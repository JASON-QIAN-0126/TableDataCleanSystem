"use client";

import { BoxReveal } from "./magicui/box-reveal";

const TitleLight = () => {
  return (
    <div className="max-w-xl pt-8">
      <BoxReveal boxColor="#9C40FF" duration={0.3}>
        <h1 className="text-5xl font-bold text-gray-900 leading-tight">
          Welcome to <span className="text-[#9C40FF]">Clean World</span>
        </h1>
      </BoxReveal>

      <BoxReveal boxColor="#9C40FF" duration={0.5}>
        <p className="mt-3 text-lg text-gray-600">
          From chaos to{" "}
          <span className="text-[#9C40FF] font-medium">clarity</span> — a system
          organize your
          <span className="text-[#9C40FF] font-medium"> tables</span> in
          seconds.
        </p>
      </BoxReveal>

      <div className="h-6" />
    </div>
  );
};

export default TitleLight;
