import { existsSync } from "node:fs";
import { expect, test } from "@playwright/test";

const LOCAL_LIB_DIR = "/tmp/pwlibs/extracted/usr/lib/x86_64-linux-gnu";
const REQUIRED_LIBS = ["libnspr4.so", "libnss3.so", "libasound.so.2"] as const;

function hasSystemDeps() {
  const searchRoots = ["/usr/lib/x86_64-linux-gnu", "/lib/x86_64-linux-gnu"];
  return REQUIRED_LIBS.every((lib) => searchRoots.some((root) => existsSync(`${root}/${lib}`)));
}

function hasLocalDeps() {
  return REQUIRED_LIBS.every((lib) => existsSync(`${LOCAL_LIB_DIR}/${lib}`));
}

if (hasLocalDeps()) {
  process.env.LD_LIBRARY_PATH = process.env.LD_LIBRARY_PATH
    ? `${LOCAL_LIB_DIR}:${process.env.LD_LIBRARY_PATH}`
    : LOCAL_LIB_DIR;
}

test.skip(
  !hasSystemDeps() && !hasLocalDeps(),
  "Chromium runtime dependencies are missing. Install Playwright browser deps or provide /tmp/pwlibs libs."
);

test("language toggle switches EN and PT content on landing page", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      name: "Turn shared dreams into small weekly wins"
    })
  ).toBeVisible();

  await page.getByRole("button", { name: "Switch to Portuguese" }).click();

  await expect(
    page.getByRole("heading", {
      name: "Transforme sonhos compartilhados em pequenas vitórias semanais"
    })
  ).toBeVisible();
});
