// 模拟数据（以后可以拆到 data.js）
let sheepList = [
  { id: 1, earTag: "Y001", gender: "母", age: 2 },
  { id: 2, earTag: "Y002", gender: "公", age: 3 }
];

// 渲染页面
function render() {
  const app = document.getElementById("app");

  let html = `
    <h2 class="text-lg font-semibold mb-3">羊只列表</h2>
    <table class="w-full border text-sm">
      <tr class="bg-gray-100">
        <th class="border p-2">耳标号</th>
        <th class="border p-2">性别</th>
        <th class="border p-2">年龄</th>
      </tr>
  `;

  sheepList.forEach(sheep => {
    html += `
      <tr>
        <td class="border p-2">${sheep.earTag}</td>
        <td class="border p-2">${sheep.gender}</td>
        <td class="border p-2">${sheep.age}</td>
      </tr>
    `;
  });

  html += `</table>`;

  app.innerHTML = html;
}

// 页面加载完成后执行
render();
