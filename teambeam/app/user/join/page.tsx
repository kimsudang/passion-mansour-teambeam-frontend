import React, { Suspense } from "react";
import dynamic from "next/dynamic";

const Join = dynamic(() => import("./_components/JoinForm"), {
  ssr: false,
});

const Page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <Join />
      </Suspense>
    </div>
  );
};

export default Page;
