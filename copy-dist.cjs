// copy-to-dist.js
const fs = require("fs-extra");
const path = require("path");

// 获取当前脚本所在目录的绝对路径
const currentDir = __dirname;

async function prepareAndCopy() {
	try {
		// 1. 定义根目标目录路径
		const rootDistPath = path.join(currentDir, "dist");

		// 2. 确保根目录存在（不存在则创建）
		if (!(await fs.pathExists(rootDistPath))) {
			console.log(`创建根目录: ${rootDistPath}`);
			await fs.mkdirp(rootDistPath);
		}

		// 3. 清空整个dist目录内容
		console.log(`清空目录内容: ${rootDistPath}`);
		await fs.emptyDir(rootDistPath);
		console.log("根目录准备完成");

		// 4. 定义拷贝任务数组：每个任务包含源目录和目标子目录
		const copyTasks = [
			{
				source: path.join(currentDir, "packages/lib/dist"),
				target: "", // 将拷贝到 dist/lib1
			},
			{
				source: path.join(currentDir, "packages/plugin/dist"),
				target: "./plugin", // 将拷贝到 dist/lib2
			},
			// 可以添加更多拷贝任务
		];

		// 5. 遍历并执行每个拷贝任务
		for (const task of copyTasks) {
			const fullTargetPath = path.join(rootDistPath, task.target);

			// 确保目标子目录存在
			await fs.mkdirp(fullTargetPath);

			console.log(`正在从 ${path.relative(currentDir, task.source)} 拷贝到 ${task.target}...`);

			if (await fs.pathExists(task.source)) {
				await fs.copy(task.source, fullTargetPath);
				console.log(`拷贝完成: ${task.source} → dist/${task.target}`);
			} else {
				console.warn(`警告: 源目录不存在 ${task.source}`);
			}
		}

		console.log("所有拷贝操作完成！");
	} catch (err) {
		console.error("操作出错:", err);
		process.exit(1);
	}
}

// 执行函数
prepareAndCopy();
