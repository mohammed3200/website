"use client";

import React from "react";
import { useMedia } from "react-use";

import MobileSidebar from "@/components/navigation/mobile-sidebar";
import DesktopMenu from "@/components/navigation/desktop-menu";

export function ResponsiveNavbar() {
    const isDesktop = useMedia("(min-width: 1024px)", true);

    return isDesktop ? <DesktopMenu /> : <MobileSidebar />;
}