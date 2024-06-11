import React, { Suspense } from "react";
import dynamic from "next/dynamic";

const SettingPassword = dynamic(() => import("./_components/SettingPassword"), {
  ssr: false,
});

const Page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <SettingPassword />
      </Suspense>
    </div>
  );
};

export default Page;
