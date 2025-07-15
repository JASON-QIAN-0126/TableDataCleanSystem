import * as XLSX from "xlsx";

type RowData = {
  [key: string]: string | number;
};

self.onmessage = (e: MessageEvent<ArrayBuffer>) => {
  try {
    const arrayBuffer = e.data;
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json<RowData>(worksheet);

    self.postMessage({ status: "success", data: jsonData });
  } catch (error) {
    self.postMessage({ status: "error", error: error });
  }
};
