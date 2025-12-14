import { Column, Record } from "PersonalKanban/types";

const DARK_MODE = "dark_mode";
const COLUMNS = "columns";

export function getItem(key: string) {
  return JSON.parse(localStorage.getItem(key)!);
}

export function setItem(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getDarkMode() {
  return getItem(DARK_MODE);
}

export function setDarkMode(value: boolean) {
  return setItem(DARK_MODE, value);
}

export function setColumns(value: Column[]) {
  return setItem(COLUMNS, value);
}

export function getColumns() {
  return getItem(COLUMNS);
}

// 导出为JSON格式
export function exportToJSON(columns: Column[]) {
  const dataStr = JSON.stringify(columns, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  return dataBlob;
}

// 将数据转换为CSV格式
export function convertToCSV(columns: Column[]) {
  let csvContent = "data:text/csv;charset=utf-8,";
  
  // 添加表头
  csvContent += "Column ID,Column Title,Column Description,Column Color,Record ID,Record Title,Record Description,Record Color,Record Created At\n";
  
  // 添加数据行
  columns.forEach(column => {
    const columnId = column.id || "";
    const columnTitle = column.title || "";
    const columnDescription = column.description || "";
    const columnColor = column.color || "";
    
    if (column.records && column.records.length > 0) {
      column.records.forEach(record => {
        const recordId = record.id || "";
        const recordTitle = record.title || "";
        const recordDescription = record.description || "";
        const recordColor = record.color || "";
        const recordCreatedAt = record.createdAt || "";
        
        const row = [
          columnId,
          `\"${columnTitle}\"`,
          `\"${columnDescription}\"`,
          columnColor,
          recordId,
          `\"${recordTitle}\"`,
          `\"${recordDescription}\"`,
          recordColor,
          recordCreatedAt
        ].join(",");
        
        csvContent += row + "\n";
      });
    } else {
      // 如果列中没有记录，也添加一行
      const row = [
        columnId,
        `\"${columnTitle}\"`,
        `\"${columnDescription}\"`,
        columnColor,
        "",
        "",
        "",
        "",
        ""
      ].join(",");
      
      csvContent += row + "\n";
    }
  });
  
  return csvContent;
}

// 导出为CSV格式
export function exportToCSV(columns: Column[]) {
  const csvContent = convertToCSV(columns);
  const encodedUri = encodeURI(csvContent);
  return encodedUri;
}

// 下载文件的通用方法
export function downloadFile(data: Blob | string, filename: string, type: "json" | "csv") {
  if (type === "json" && data instanceof Blob) {
    const url = URL.createObjectURL(data);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else if (type === "csv" && typeof data === "string") {
    const link = document.createElement("a");
    link.setAttribute("href", data);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

const StorageService = {
  getItem,
  setItem,
  getDarkMode,
  setDarkMode,
  getColumns,
  setColumns,
  exportToJSON,
  exportToCSV,
  downloadFile
};

export default StorageService;
