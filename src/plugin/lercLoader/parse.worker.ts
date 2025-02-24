import { parse } from "./parse";

self.onmessage = (msg: MessageEvent) => {
	const data = msg.data;
	const mesh = parse(data.demData, data.z, data.clipBounds);
	self.postMessage(mesh);
	self.close();
};
