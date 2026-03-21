/// <reference types="astro/client" />

import type { Runtime } from "@astrojs/cloudflare";

type Env = {};

declare namespace App {
	interface Locals extends Runtime<Env> {}
}
