export function exportDateTimeCSV(csv, fileName) {
    var exportedFilenmae = fileName || "export.csv";
    var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    var downloadUrl = window.URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = downloadUrl;
    a.download = exportedFilenmae;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(downloadUrl);
    document.body.removeChild(a);
}

const convertJSONToCSV = (objArray) => {
    var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
    var str = "";

    for (var i = 0; i < array.length; i++) {
        var line = "";
        for (var index in array[i]) {
            if (line !== "") line += ",";

            line += array[i][index];
        }

        str += line + "\r\n";
    }

    return str;
};

export const convertJSONToTxt = (objArray) => {
    var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
    var str = "";

    for (var i = 0; i < array.length; i++) {
        var line = "";
        for (var index in array[i]) {
            if (line !== "") line += "    ";

            line += array[i][index];
        }

        str += line + "\r\n";
    }

    return str;
};

export const exportDatatableCSV = (
    items = [
        ["Heading 1", "Heading 2"],
        ["Data 1", "Data 2"]
    ],
    exportedFileName = "export.csv"
) => {
    const jsonObject = JSON.stringify(items);
    const csv = convertJSONToCSV(jsonObject);

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = exportedFileName;
    document.body.appendChild(a);
    a.click();
    // remove the element from DOM
    URL.revokeObjectURL(downloadUrl);
    document.body.removeChild(a);
};

export function exportToJson(content, fileName) {
    var exportedFilenmae = fileName || "export.json";
    var blob = new Blob([content], { type: "text/json" });
    var downloadUrl = window.URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = downloadUrl;
    a.download = exportedFilenmae;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(downloadUrl);
    document.body.removeChild(a);
}

export function exportToTxt(text, fileName) {
    var exportedFilenmae = fileName || "export.txt";
    var blob = new Blob([text], { type: "text/plain;charset=utf-8;" });
    var downloadUrl = window.URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = downloadUrl;
    a.download = exportedFilenmae;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(downloadUrl);
    document.body.removeChild(a);
}