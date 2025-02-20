import { parse } from "./parse";

self.onmessage = (msg: MessageEvent) => {
	const { buffer } = msg.data;
	parse(buffer).then((mesh) => {
		self.postMessage(mesh);
		self.close();
	});
};
