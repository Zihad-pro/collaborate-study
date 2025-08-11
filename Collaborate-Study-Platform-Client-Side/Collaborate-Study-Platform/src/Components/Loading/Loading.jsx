import React from "react";
import { SyncLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <SyncLoader color="#36d7b7" size={12} />
    </div>
  );
};

export default Loading;
