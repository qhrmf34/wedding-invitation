const uniqueIdentifier = "JWK-WEDDING-TEMPLATE-V1";

type GalleryLayout = "scroll" | "grid";
type GalleryPosition = "middle" | "bottom";

interface GalleryConfig {
  layout: GalleryLayout;
  position: GalleryPosition;
  images: string[];
}

export const weddingConfig = {
  // 메타 정보
  meta: {
    title: "길태영 & 박지우의 결혼식에 초대합니다",
    description: "결혼식 초대장",
    ogImage: "/images/ha0h-1fsi-bqt3.jpg",
    noIndex: true,
    _jwk_watermark_id: uniqueIdentifier,
  },

  // 메인 화면
  main: {
    title: "Wedding Invitation",
    image: "/images/ha0h-1fsi-bqt3.jpg",
    date: "2026년 5월 16일 토요일 12시 30분",
    venue: "웨딩홀 이름",
  },

  // 소개글
  intro: {
    title: "",
    text: "서로를 바라보며 걸어온\n소중한 발걸음이\n이제 하나의 길로 이어집니다.\n\n사랑과 믿음으로\n새 가정을 이루는 저희 두 사람의\n작은 시작을 알려드립니다.",
  },

  // 결혼식 일정
  date: {
    year: 2026,
    month: 5,
    day: 16,
    hour: 12,
    minute: 30,
    displayDate: "2026.05.16 SAT PM 12:30",
  },

  // 장소 정보
  venue: {
    name: "웨딩홀 이름",
    address: "서울특별시 강남구 테헤란로 123\n웨딩홀 이름",
    tel: "02-1234-5678",
    naverMapId: "웨딩홀 이름",
    coordinates: {
      latitude: 37.5665,
      longitude: 126.9780,
    },
    placeId: "123456789",
    mapZoom: "17",
    mapNaverCoordinates: "14141300,4507203,15,0,0,0,dh",
    transportation: {
      subway: "지하철역 1번 출구에서 도보 5분",
      bus: "간선\n 101, 102, 103\n지선\n 1234, 5678",
    },
    parking: "건물 지하 주차장 이용 가능 (2시간 무료)",
    groomShuttle: {
      location: "신랑측 배차 출발지",
      departureTime: "오전 10시 30분 출발",
      contact: {
        name: "담당자명",
        tel: "010-1234-5678",
      },
    },
    brideShuttle: {
      location: "신부측 배차 출발지",
      departureTime: "오전 11시 출발",
      contact: {
        name: "담당자명",
        tel: "010-9876-5432",
      },
    },
  },

  // 갤러리
  gallery: {
    layout: "grid" as GalleryLayout,
    position: "middle" as GalleryPosition,
    images: [
      "/images/gallery/image1.jpg",
      "/images/gallery/image2.jpg",
      "/images/gallery/image3.jpg",
      "/images/gallery/image4.jpg",
      "/images/gallery/image5.jpg",
      "/images/gallery/image6.jpg",
      "/images/gallery/image7.jpg",
      "/images/gallery/image8.jpg",
      "/images/gallery/image9.jpg",
    ],
  } as GalleryConfig,

  // 초대의 말씀
  invitation: {
    message: "한 줄기 별빛이 되어 만난 인연\n평생을 함께 걸어가려 합니다.\n\n소중한 분들의 축복 속에\n저희 두 사람이 첫 걸음을 내딛습니다.\n\n귀한 시간 내어 함께해 주신다면\n그 어떤 축복보다 값진 선물이 될 것입니다.",
    groom: {
      name: "길태영",
      label: "아들",
      father: "신랑아버지",
      mother: "신랑어머니",
      tel: "010-1234-5678",
      fatherTel: "010-1111-2222",
      motherTel: "010-3333-4444",
    },
    bride: {
      name: "박지우",
      label: "딸",
      father: "신부아버지",
      mother: "신부어머니",
      tel: "010-9876-5432",
      fatherTel: "010-5555-6666",
      motherTel: "010-7777-8888",
    },
  },

  // 계좌번호
  account: {
    groom: {
      bank: "은행명",
      number: "123-456-789012",
      holder: "길태영",
    },
    bride: {
      bank: "은행명",
      number: "987-654-321098",
      holder: "박지우",
    },
    groomFather: {
      bank: "은행명",
      number: "111-222-333444",
      holder: "신랑아버지",
    },
    groomMother: {
      bank: "은행명",
      number: "555-666-777888",
      holder: "신랑어머니",
    },
    brideFather: {
      bank: "은행명",
      number: "999-000-111222",
      holder: "신부아버지",
    },
    brideMother: {
      bank: "은행명",
      number: "333-444-555666",
      holder: "신부어머니",
    },
  },

  // RSVP 설정
  rsvp: {
    enabled: true,
    showMealOption: true,
  },

  // 방명록 설정
  guestbook: {
    enabled: true,
    showRecentMessages: true,
    maxRecentMessages: 5,
  },

  // 음악 설정
  music: {
    enabled: true,
    src: "/music/wedding-bgm.mp3", // public/music/ 폴더에 파일 추가
    autoPlay: false,
  },

  // 백엔드 API 설정 (Spring Boot)
  api: {
    baseUrl: "", // 클라이언트 사이드에서는 Next.js API route 사용 (/api/...)
  },

  // 슬랙 알림 설정 (레거시)
  slack: {
    webhookUrl: process.env.NEXT_PUBLIC_SLACK_WEBHOOK_URL || "",
    channel: "#wedding-response",
    compactMessage: true,
  },
};
