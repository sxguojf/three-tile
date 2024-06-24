import { test, expect } from "vitest";
import { ProjMCT } from "../map/projection/ProjMCT";

test("墨卡托投影", () => {
	// lon：[-180,180]
	// lat：[-85.05112877980659，85.05112877980659]
	// x：[-20037508.3427892,20037508.3427892]
	// y：[-20037508.3427892,20037508.3427892]

	const mct = new ProjMCT(0);

	const pos1 = mct.project(0, 0);
	expect(pos1.x).toBeCloseTo(0, 0);
	expect(pos1.y).toBeCloseTo(0, 0);

	const pos2 = mct.project(-180, 85.05112878);
	expect(pos2.x).toBeCloseTo(-20037, 0);
	expect(pos2.y).toBeCloseTo(20037, 0);

	const pos3 = mct.project(180, -85.05112878);
	expect(pos3.x).toBeCloseTo(20037, 0);
	expect(pos3.y).toBeCloseTo(-20037, 0);

	for (let lon = -180; lon < 180; lon++) {
		for (let lat = -85; lat < 85; lat++) {
			const pos = mct.project(lon, lat);
			const lonlat = mct.unProject(pos.x, pos.y);
			expect(lon).toBeCloseTo(lonlat.lon, 0);
			expect(lat).toBeCloseTo(lonlat.lat, 0);
		}
	}
});

test("墨卡托投影-带中央经线", () => {
	for (let lon = -180; lon <= 180; lon++) {
		const mct = new ProjMCT(lon);
		const pos4 = mct.project(lon, 0);
		expect(pos4.x).toBeCloseTo(0, 0);
	}

	let mct = new ProjMCT(90);
	const pos1 = mct.project(-180 + 90, 0);
	mct = new ProjMCT(0);
	const pos2 = mct.project(-180, 0);
	expect(pos1.x).toBeCloseTo(pos2.x);

	mct = new ProjMCT(90);
	const pos3 = mct.project(180 + 90, 0);
	mct = new ProjMCT(0);
	const pos4 = mct.project(180, 0);
	expect(pos3.x).toBeCloseTo(pos4.x);
});

test("瓦片坐标投影变换", () => {
	const mct1 = new ProjMCT(90);
	// for (let lon = -180; lon <= 180; lon += 11.25) {
	// 	const pos1 = mct1.project(lon + 90, 0);
	// 	console.log(lon + 90, pos1.x);
	// }
	// console.log();

	// for (let x = 0; x <= 16; x++) {
	// 	const pos1 = mct1.getTileXYZproj(x, 0, 4);
	// 	console.log(x, pos1.x);
	// }

	const pos1 = mct1.project(-90, 0);
	const pos2 = mct1.getTileXYZproj(0, 0, 0);
	expect(pos1.x).toBeCloseTo(pos2.x);

	const pos3 = mct1.project(270, 0);
	const pos4 = mct1.getTileXYZproj(16, 0, 4);
	expect(pos3.x).toBeCloseTo(pos4.x, 1);
});
