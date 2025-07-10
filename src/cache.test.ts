import { describe, expect, it, vi } from "vitest";
import { cache } from "./cache";

describe("cache", () => {
  it("returns the cached value if called multiple times within timeout", async () => {
    let callCount = 0;
    const getValue = vi.fn(async () => {
      callCount++;
      return "value";
    });
    const cached = cache(getValue, 1000);

    const v1 = await cached.get();
    const v2 = await cached.get();
    expect(v1).toBe("value");
    expect(v2).toBe("value");
    expect(callCount).toBe(1);
  });

  it("reloads value after timeout", async () => {
    let callCount = 0;
    const getValue = vi.fn(async () => {
      callCount++;
      return "value" + callCount;
    });
    const cached = cache(getValue, 10);

    const v1 = await cached.get();
    await new Promise((r) => setTimeout(r, 20));
    const v2 = await cached.get();
    expect(v1).toBe("value1");
    expect(v2).toBe("value2");
    expect(callCount).toBe(2);
  });

  it("reloads value when forceGet is called", async () => {
    let callCount = 0;
    const getValue = vi.fn(async () => {
      callCount++;
      return "forced" + callCount;
    });
    const cached = cache(getValue, 1000);

    const v1 = await cached.get();
    const v2 = await cached.forceGet();
    expect(v1).toBe("forced1");
    expect(v2).toBe("forced2");
    expect(callCount).toBe(2);
  });

  it("handles concurrent calls and only loads once", async () => {
    let callCount = 0;
    let resolve: (v: string) => void;
    const getValue = vi.fn(
      () =>
        new Promise<string>((r) => {
          callCount++;
          resolve = r;
        })
    );
    const cached = cache(getValue, 1000);

    const p1 = cached.get();
    const p2 = cached.get();
    resolve!("concurrent");
    const v1 = await p1;
    const v2 = await p2;
    expect(v1).toBe("concurrent");
    expect(v2).toBe("concurrent");
    expect(callCount).toBe(1);
  });

  it("propagates errors and allows retry after failure", async () => {
    let callCount = 0;
    const getValue = async () => {
      callCount++;
      if (callCount === 1) throw new Error("fail" + callCount);
      return "success";
    };
    const cached = cache(getValue, 1000);

    await expect(cached.get()).rejects.toThrowError("fail");
    const v = await cached.get();
    expect(v).toBe("success");
    expect(callCount).toBe(2);
  });
});
