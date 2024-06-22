import { test, expect } from "vitest";
import { ProjMCT } from "../map/projection/ProjMCT";

test("WEB墨卡托投影", () => {
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

test("WEB墨卡托投影-中心经度", () => {
	const mct = new ProjMCT(0);

	for (let lon = -180; lon <= 180; lon++) {
		mct.centralMeridian = lon;
		const pos4 = mct.project(lon, 0);
		expect(pos4.x).toBeCloseTo(0, 0);
	}

	mct.centralMeridian = 90;
	const pos1 = mct.project(-180 + 90, 0);
	mct.centralMeridian = 0;
	const pos2 = mct.project(-180, 0);
	expect(pos1.x).toBeCloseTo(pos2.x);

	mct.centralMeridian = 90;
	const pos3 = mct.project(180 + 90, 0);
	mct.centralMeridian = 0;
	const pos4 = mct.project(180, 0);
	expect(pos3.x).toBeCloseTo(pos4.x);
});
