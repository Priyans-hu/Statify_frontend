'use client';

import { useSelector } from "react-redux";
import { store } from "@/app/store";
type RootState = ReturnType<typeof store.getState>;
import React from "react";
import {Spin} from "antd";

export default function LoadingWrapper({ children }: { children: React.ReactNode }) {
  const isLoading = useSelector((state: RootState) => state.loading.loading);

  return (
    <Spin spinning={isLoading}>
      {children}
    </Spin>
  );
};
