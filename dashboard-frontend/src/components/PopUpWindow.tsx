import React from "react";
import ReactDOM from "react-dom";

export default function PopUpWindow({ children }: { children: React.ReactNode }) {
  return ReactDOM.createPortal(
    <div
      style={{
        position: "fixed",
        zIndex: 9999,
        left: 0,
        top: 0,
        pointerEvents: "auto",
      }}
    >
      {children}
    </div>,
    document.body
  );
}
