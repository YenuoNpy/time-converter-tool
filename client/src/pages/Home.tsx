import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Check } from "lucide-react";

/**
 * 时间转换工具主页面
 * 设计风格：柔和现代风格
 * - 蓝色和紫色配色，浅蓝白背景
 * - 卡片式布局，充足的空间和微交互
 * - Poppins 标题字体 + Inter 正文字体
 */

// 格式化时间为 YYYY-MM-DD HH:MM:SS 格式
function formatTime(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

interface TimeDisplay {
  utc8: string;
  utcMinus8: string;
  timestamp: number;
  date: string;
}

export default function Home() {
  const [currentTime, setCurrentTime] = useState<TimeDisplay>({
    utc8: "",
    utcMinus8: "",
    timestamp: 0,
    date: "",
  });

  const [timestampInput, setTimestampInput] = useState("");
  const [convertedTime, setConvertedTime] = useState({
    utc8: "",
    utcMinus8: "",
  });

  const [dateInput, setDateInput] = useState("");
  const [convertedTimestamp, setConvertedTimestamp] = useState("");

  const [copiedField, setCopiedField] = useState<string | null>(null);

  // 更新当前时间
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timestamp = Math.floor(now.getTime() / 1000);

      // UTC+8 时间
      const utc8Time = new Date(now.getTime() + 8 * 60 * 60 * 1000);
      const utc8Str = `${formatTime(utc8Time)} UTC+8`;

      // UTC-8 时间
      const utcMinus8Time = new Date(now.getTime() - 8 * 60 * 60 * 1000);
      const utcMinus8Str = `${formatTime(utcMinus8Time)} UTC-8`;

      setCurrentTime({
        utc8: utc8Str,
        utcMinus8: utcMinus8Str,
        timestamp: timestamp,
        date: now.toLocaleString("zh-CN"),
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // 时间戳转换
  const handleTimestampConvert = () => {
    if (!timestampInput) return;

    const ts = parseInt(timestampInput);
    if (isNaN(ts)) {
      alert("请输入有效的时间戳");
      return;
    }

    const date = new Date(ts * 1000);

    // UTC+8
    const utc8 = new Date(date.getTime() + 8 * 60 * 60 * 1000);
    const utc8Str = `${formatTime(utc8)} UTC+8`;

    // UTC-8
    const utcMinus8 = new Date(date.getTime() - 8 * 60 * 60 * 1000);
    const utcMinus8Str = `${formatTime(utcMinus8)} UTC-8`;

    setConvertedTime({
      utc8: utc8Str,
      utcMinus8: utcMinus8Str,
    });
  };

  // 日期转时间戳
  const handleDateConvert = () => {
    if (!dateInput) return;

    try {
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) {
        alert("请输入有效的日期时间");
        return;
      }

      const timestamp = Math.floor(date.getTime() / 1000);
      setConvertedTimestamp(timestamp.toString());
    } catch {
      alert("日期转换失败");
    }
  };

  // 复制到剪贴板
  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-display font-bold text-gray-900 mb-3">
            时间转换工具
          </h1>
          <p className="text-lg text-gray-600">
            实时显示和转换 UTC-8、UTC+8 时间与时间戳
          </p>
        </div>

        {/* 实时显示区域 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* UTC+8 卡片 */}
          <Card className="bg-white border-2 border-blue-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100">
              <CardTitle className="text-blue-900 font-display">
                UTC+8 时间
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-sm text-gray-600 mb-2">当前时间</p>
                  <p className="text-lg font-mono text-blue-900 break-all">
                    {currentTime.utc8}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(currentTime.utc8, "utc8")}
                  className="w-full border-blue-200 hover:bg-blue-50"
                >
                  {copiedField === "utc8" ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      已复制
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      复制
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* UTC-8 卡片 */}
          <Card className="bg-white border-2 border-purple-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
              <CardTitle className="text-purple-900 font-display">
                UTC-8 时间
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <p className="text-sm text-gray-600 mb-2">当前时间</p>
                  <p className="text-lg font-mono text-purple-900 break-all">
                    {currentTime.utcMinus8}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(currentTime.utcMinus8, "utcMinus8")
                  }
                  className="w-full border-purple-200 hover:bg-purple-50"
                >
                  {copiedField === "utcMinus8" ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      已复制
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      复制
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 时间戳卡片 */}
          <Card className="bg-white border-2 border-blue-300 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-blue-100 to-blue-50 border-b border-blue-200">
              <CardTitle className="text-blue-900 font-display">
                Unix 时间戳
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-sm text-gray-600 mb-2">当前时间戳</p>
                  <p className="text-lg font-mono text-blue-900">
                    {currentTime.timestamp}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(currentTime.timestamp.toString(), "ts")
                  }
                  className="w-full border-blue-200 hover:bg-blue-50"
                >
                  {copiedField === "ts" ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      已复制
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      复制
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 转换工具区域 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 时间戳转换 */}
          <Card className="bg-white border-2 border-blue-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100">
              <CardTitle className="text-blue-900 font-display">
                时间戳转换
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    输入 Unix 时间戳
                  </label>
                  <Input
                    type="number"
                    placeholder="例如: 1707561600"
                    value={timestampInput}
                    onChange={(e) => setTimestampInput(e.target.value)}
                    className="border-blue-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <Button
                  onClick={handleTimestampConvert}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-display"
                >
                  转换
                </Button>

                {convertedTime.utc8 && (
                  <div className="space-y-3 pt-4 border-t border-blue-100">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                      <p className="text-xs text-gray-600 mb-1">UTC+8</p>
                      <p className="text-sm font-mono text-blue-900 break-all">
                        {convertedTime.utc8}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(convertedTime.utc8, "conv-utc8")
                        }
                        className="mt-2 text-blue-600 hover:bg-blue-100"
                      >
                        {copiedField === "conv-utc8" ? (
                          <>
                            <Check className="w-4 h-4 mr-1" />
                            已复制
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-1" />
                            复制
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                      <p className="text-xs text-gray-600 mb-1">UTC-8</p>
                      <p className="text-sm font-mono text-purple-900 break-all">
                        {convertedTime.utcMinus8}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(
                            convertedTime.utcMinus8,
                            "conv-utcMinus8"
                          )
                        }
                        className="mt-2 text-purple-600 hover:bg-purple-100"
                      >
                        {copiedField === "conv-utcMinus8" ? (
                          <>
                            <Check className="w-4 h-4 mr-1" />
                            已复制
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-1" />
                            复制
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 日期转时间戳 */}
          <Card className="bg-white border-2 border-purple-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
              <CardTitle className="text-purple-900 font-display">
                日期转时间戳
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    输入日期时间
                  </label>
                  <Input
                    type="datetime-local"
                    value={dateInput}
                    onChange={(e) => setDateInput(e.target.value)}
                    className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>
                <Button
                  onClick={handleDateConvert}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-display"
                >
                  转换
                </Button>

                {convertedTimestamp && (
                  <div className="pt-4 border-t border-purple-100">
                    <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                      <p className="text-xs text-gray-600 mb-1">Unix 时间戳</p>
                      <p className="text-sm font-mono text-purple-900">
                        {convertedTimestamp}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(convertedTimestamp, "conv-ts")
                        }
                        className="mt-2 text-purple-600 hover:bg-purple-100"
                      >
                        {copiedField === "conv-ts" ? (
                          <>
                            <Check className="w-4 h-4 mr-1" />
                            已复制
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-1" />
                            复制
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 页脚提示 */}
        <div className="mt-12 text-center text-gray-600 text-sm">
          <p>💡 提示：Unix 时间戳是从 1970-01-01 00:00:00 UTC 开始的秒数</p>
        </div>
      </div>
    </div>
  );
}
