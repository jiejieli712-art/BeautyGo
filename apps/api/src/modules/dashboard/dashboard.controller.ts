import { Controller, Get } from "@nestjs/common";
import { ArtistApplicationsStore } from "../artist-applications/artist-applications.store";
import { BookingsStore } from "../bookings/bookings.store";
import { listArtists } from "../marketplace/marketplace.store";

@Controller("dashboard")
export class DashboardController {
  constructor(
    private readonly applicationsStore: ArtistApplicationsStore,
    private readonly bookingsStore: BookingsStore
  ) {}

  @Get("summary")
  getSummary() {
    const artists = listArtists();
    const allPackages = artists.flatMap((a) => a.servicePackages);
    const allScenes = new Set(allPackages.map((p) => p.scene));

    return {
      project: {
        name: "BeautyGo",
        positioning: "AI 产品经理作品集 — 上门美妆 O2O 双边撮合平台",
        milestone: "M4: 后台看板与演示收尾",
        demoLines: [
          "作品集概览（super-app 默认页）",
          "客户模拟预约（功能演示 > 客户角色）",
          "化妆师入驻审核（功能演示 > 化妆师/运营角色）",
          "后台运营看板（admin-web Dashboard）"
        ]
      },
      supply: {
        totalApplications: this.applicationsStore.countAll(),
        pending: this.applicationsStore.countByStatus("pending"),
        trial: this.applicationsStore.countByStatus("trial"),
        approved: this.applicationsStore.countByStatus("approved"),
        rejected: this.applicationsStore.countByStatus("rejected")
      },
      demand: {
        totalBookings: this.bookingsStore.countAll(),
        created: this.bookingsStore.countByStatus("created"),
        confirmed: this.bookingsStore.countByStatus("confirmed"),
        cancelled: this.bookingsStore.countByStatus("cancelled"),
        artistCount: artists.length,
        packageCount: allPackages.length,
        sceneCount: allScenes.size
      },
      portfolio: {
        docsReady: true,
        aiCollaborationVisible: true,
        runnableMvp: true,
        testStatus: "36 tests passing"
      }
    };
  }
}
