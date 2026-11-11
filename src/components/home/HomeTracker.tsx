"use client";
import { useEffect } from "react";
import { analyticsService } from "@/services/analytics/analytics";
export function HomeTracker() { useEffect(() => analyticsService.track("home_view"), []); return null; }
