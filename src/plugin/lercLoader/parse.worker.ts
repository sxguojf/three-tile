import { parse } from "./parse";

self.onmessage = (msg: MessageEvent) => {
	const { buffer, width, height } = msg.data;
	parse(buffer, width, height).then((mesh) => {
		self.postMessage(mesh);
		self.close();
	});
};
