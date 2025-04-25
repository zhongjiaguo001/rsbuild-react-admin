// src/pages/system/error/ErrorPage.tsx
interface ErrorPageProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

const ErrorPage = ({ error, resetErrorBoundary }: ErrorPageProps) => {
  return (
    <div className="error-page">
      <h1>发生错误</h1>
      <p>抱歉，应用程序遇到了一个错误</p>
      {error && <p className="error-message">错误信息: {error.message}</p>}
      {resetErrorBoundary && <button onClick={resetErrorBoundary}>重试</button>}
    </div>
  );
};

export default ErrorPage;
