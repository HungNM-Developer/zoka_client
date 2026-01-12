export type Language = 'en' | 'vi';

export const translations = {
  en: {
    // Login / Intro
    establishing_uplink: "Establishing Uplink",
    syncing_arena: "Synchronizing with Arena Hub...",
    strategic_protocol: "Strategic Combat Protocol",
    tactical_depth: "Tactical Depth",
    tactical_desc: "Complex element counter system",
    swift_rounds: "Swift Rounds",
    swift_desc: "Fast-paced card battles",
    multiplayer: "Multiplayer",
    multiplayer_desc: "Up to 100 units per sector",
    global_rank: "Global Rank",
    global_desc: "Climb the leaderboard",
    identity_auth: "Identity Authorization",
    init_profile: "Initialize combat profile",
    operator_designation: "OPERATOR_DESIGNATION",
    callsign_placeholder: "CALLSIGN...",
    quick_join_code: "QUICK_JOIN_CODE (OPTIONAL)",
    authorize_deploy: "AUTHORIZE & DEPLOY",
    establishing_link: "ESTABLISHING SECURE LINK...",

    // Header
    warzone: "WARZONE",
    network_command: "Network Command",
    identity: "Identity",
    status_connected: "Status: Connected",
    initiate_sector: "INITIATE SECTOR",
    
    // Tabs
    tab_lobby: "Lobby",
    tab_rules: "Rules",
    tab_profile: "Profile",

    // Sidebar
    combat_stats: "Combat Stats",
    matches_won: "Matches Won",
    win_rate: "Win Rate",
    stars_earned: "Stars Earned",
    target_code: "Target Code",
    deploy_unit: "DEPLOY UNIT",
    place_code: "CODE",

    // Lobby
    live_sectors: "Live Sectors",
    broadcasting_signal: "Broadcasting Signal",
    awaiting_transmissions: "Awaiting Transmissions",
    no_active_sectors: "No active battle sectors detected on this frequency.",
    initiate_first_sector: "Initiate First Sector",
    engaged: "ENGAGED",
    open: "OPEN",
    units: "UNITS",

    // Rules
    strategic_briefing: "Operational Briefing v5.2",
    combat_objectives: "Combat Objectives",
    obj_survive: "Survive",
    obj_survive_desc: "Start with 55 combat stars. Don't let them hit zero.",
    obj_dominance: "Dominance",
    obj_dominance_desc: "Win rounds to gain stars equal to your card's value.",
    obj_attrition: "Attrition",
    obj_attrition_desc: "Matches last 10 rounds. Highest total stars wins.",
    
    elemental_matrix: "Elemental Counter Matrix",
    countered_by: "Countered by",
    
    advanced_mechanics: "Advanced Mechanics & Scoring",
    scoring_breakdown: "Scoring Calculation",
    
    mech_standard_win: "Standard Counter Victory",
    mech_standard_desc: "If Element A counters B: Winner gains their card's stars (+Stars). Loser deducts their card's stars (-Stars).",
    
    mech_overpower: "Overpower Rule (Reversal)",
    mech_overpower_desc: "If Disadvantaged Element (B) has > 2x Stars of Attacker (A): B Wins. B gains (+Stars), A loses (-Stars).",
    
    mech_draw: "Stalemate / Neutral",
    mech_draw_desc: "If no counters exist (or same elements): The cards with the HIGHEST stars win. Winners (+Stars), Losers (-Stars).",

    mech_perfect_draw: "Perfect Counter Draw",
    mech_perfect_draw_desc: "If Disadvantaged Element has EXACTLY 2x Stars of Attacker: It's a DRAW. No stars change.",

    auto_deploy: "Auto-Deploy Protocol",
    auto_deploy_desc: "Refusal to act within 20s forces auto-deployment of lowest power unit.",

    // Profile
    rank_elite: "RANK: ELITE",
    registered_unit: "Registered War Unit alpha-7",
    fav_element: "Favorite Element",
    highest_stars: "Highest Stars",

    // Modal
    initiate_sector_modal: "Initiate Sector",
    configure_tactical: "Configure Tactical Parameters",
    units_limit: "UNITS LIMIT",
    deployment_capacity: "Deployment capacity",
    deploy_sector: "DEPLOY SECTOR",
    
    // Footer
    broadcasting_status: "Broadcasting Status: Synchronized",
    region: "Region: SouthEast-1",

    // Waiting Room
    boarding_protocol: "Boarding Protocol",
    recruitment_phase: "Recruitment Phase",
    sector_access: "Sector Access",
    copy_invite: "Copy Invite",
    ready_to_strike: "READY TO STRIKE",
    preparing: "PREPARING",
    mark_ready: "MARK READY",
    ready: "READY",
    initialize_battle: "INITIALIZE BATTLE",
    kick_combatant: "Kick Combatant",
    min_players_warning: "Minimum 4 combatants required",
    waiting_for_all_ready: "Awaiting all units to be ready",
    invite_friends: "Invite allies to this sector",
    room_settings: "Sector Settings",
    commander_rank: "Commander Rating",

    // In-Game
    link_copied: "LINK COPIED",
    link_copied_desc: "Invite link has been copied to clipboard.",
    round_analysis: "Round Analysis",
    intel_report: "Intelligence Report Compiled",
    card_stars: "Card",
    updated_rating: "Updated Rating",
    protocol_restarting: "Protocol Restarting In",
    standings: "Standings",
    logs: "Logs",
    element_clusters: "Element Clusters",
    engagement_round: "Engagement Round",
    time_remaining: "Local Time Remaining",
    commander_authorized: "COMMANDER AUTHORIZED",
    intel_uploading: "INTEL UPLOADING...",
    awaiting_clash: "Awaiting Clash",
    tactical_guide: "Tactical Guide",
    my_inventory: "My Inventory",
    modules: "Modules",
    execute_deployment: "EXECUTE DEPLOYMENT",
    waiting_for: "Waiting for",
    victory_tally: "Victory Tally",
    protocol_terminated: "Protocol Session Terminated",
    arena_superior: "Arena Superior",
    combatant: "Combatant",
    redeploy_lobby: "REDEPLOY TO LOBBY",
    exit_arena: "EXIT ARENA",
    battle_archives: "Battle Archives",
    full_history: "Full Engagement History",
    archives_empty: "Archives Empty",
    used: "Used",
  },
  vi: {
    // Login / Intro
    establishing_uplink: "Đang Thiết Lập Kết Nối",
    syncing_arena: "Đang đồng bộ với Máy Chủ Đấu Trường...",
    strategic_protocol: "Giao Thức Chiến Đấu",
    tactical_depth: "Chiều Sâu Chiến Thuật",
    tactical_desc: "Hệ thống khắc chế nguyên tố phức tạp",
    swift_rounds: "Vòng Đấu Tốc Độ",
    swift_desc: "Các trận đấu thẻ bài nhịp độ nhanh",
    multiplayer: "Nhiều Người Chơi",
    multiplayer_desc: "Tối đa 100 đơn vị mỗi khu vực",
    global_rank: "Xếp Hạng Toàn Cầu",
    global_desc: "Leo lên bảng xếp hạng",
    identity_auth: "Xác Thực Danh Tính",
    init_profile: "Khởi tạo hồ sơ chiến đấu",
    operator_designation: "MÃ ĐỊNH DANH ĐIỀU HÀNH",
    callsign_placeholder: "MẬT DANH...",
    quick_join_code: "MÃ THAM GIA NHANH (TÙY CHỌN)",
    authorize_deploy: "XÁC THỰC & TRIỂN KHAI",
    establishing_link: "ĐANG THIẾT LẬP ĐƯỜNG TRUYỀN BẢO MẬT...",

    // Header
    warzone: "CHIẾN KHU",
    network_command: "Chỉ Huy Mạng Lưới",
    identity: "Danh tính",
    status_connected: "Trạng thái: Đã kết nối",
    initiate_sector: "KHỞI TẠO KHU VỰC",
    
    // Tabs
    tab_lobby: "Sảnh",
    tab_rules: "Luật",
    tab_profile: "Hồ Sơ",

    // Sidebar
    combat_stats: "Thống Kê Chiến Đấu",
    matches_won: "Trận Thắng",
    win_rate: "Tỉ Lệ Thắng",
    stars_earned: "Sao Đã Kiếm",
    target_code: "Mã Mục Tiêu",
    deploy_unit: "TRIỂN KHAI",
    place_code: "MÃ",

    // Lobby
    live_sectors: "Khu Vực Hoạt Động",
    broadcasting_signal: "Đang Phát Tín Hiệu",
    awaiting_transmissions: "Đang Chờ Truyền Tin",
    no_active_sectors: "Không phát hiện khu vực chiến đấu nào trên tần số này.",
    initiate_first_sector: "Khởi Tạo Khu Vực Đầu Tiên",
    engaged: "GIAO TRANH",
    open: "MỞ",
    units: "ĐƠN VỊ",

    // Rules
    strategic_briefing: "Tóm Tắt Chiến Dịch v5.2",
    combat_objectives: "Mục Tiêu Chiến Đấu",
    obj_survive: "Sinh Tồn",
    obj_survive_desc: "Bắt đầu với 55 sao. Đừng để chúng về 0.",
    obj_dominance: "Thống Trị",
    obj_dominance_desc: "Thắng vòng đấu để nhận số sao bằng giá trị thẻ bài.",
    obj_attrition: "Tiêu Hao",
    obj_attrition_desc: "Trận đấu kéo dài 10 vòng. Ai nhiều sao nhất sẽ thắng.",
    
    elemental_matrix: "Ma Trận Khắc Chế Nguyên Tố",
    countered_by: "Bị khắc bởi",
    
    advanced_mechanics: "Cơ Chế & Tính Điểm Chi Tiết",
    scoring_breakdown: "Cách Tính Điểm",
    
    mech_standard_win: "Chiến Thắng Khắc Chế Chuẩn",
    mech_standard_desc: "Nếu A khắc B: Người thắng nhận cộng sao thẻ của mình (+Sao). Người thua bị trừ sao thẻ của mình (-Sao).",
    
    mech_overpower: "Luật Áp Đảo (Lật Kèo)",
    mech_overpower_desc: "Nếu Nguyên Tố Bị Khắc (B) có số Sao > 2 lần Kẻ Tấn Công (A): B Thắng. B được cộng (+Sao), A bị trừ (-Sao).",
    
    mech_draw: "Hòa / Trung Lập",
    mech_draw_desc: "Nếu không ai khắc ai (hoặc cùng hệ): Những thẻ có số sao CAO NHẤT sẽ thắng. Thắng (+Sao), Thua (-Sao).",

    mech_perfect_draw: "Hòa Khắc Chế Tuyệt Đối",
    mech_perfect_draw_desc: "Nếu Nguyên Tố Bị Khắc có số sao ĐÚNG BẰNG 2 lần Kẻ Tấn Công: HÒA. Không ai bị trừ sao.",

    auto_deploy: "Giao Thức Tự Động",
    auto_deploy_desc: "Không hành động trong 20s sẽ buộc hệ thống tự đánh quân bài thấp nhất.",

    // Profile
    rank_elite: "HẠNG: TINH ANH",
    registered_unit: "Đơn vị chiến đấu đăng ký alpha-7",
    fav_element: "Nguyên Tố Ưa Thích",
    highest_stars: "Sao Cao Nhất",

    // Modal
    initiate_sector_modal: "Khởi Tạo Khu Vực",
    configure_tactical: "Cấu Hình Tham Số Chiến Thuật",
    units_limit: "GIỚI HẠN ĐƠN VỊ",
    deployment_capacity: "Sức chứa triển khai",
    deploy_sector: "TRIỂN KHAI KHU VỰC",
    
    // Footer
    broadcasting_status: "Trạng Thái Phát Sóng: Đồng Bộ",
    region: "Khu Vực: Đông Nam Á-1",

    // Waiting Room
    boarding_protocol: "Giao Thức Chuẩn Bị",
    recruitment_phase: "Giai Đoạn Tuyển Quân",
    sector_access: "Truy Cập Khu Vực",
    copy_invite: "Sao Chép Lời Mời",
    ready_to_strike: "SẴN SÀNG TÁC CHIẾN",
    preparing: "ĐANG CHUẨN BỊ",
    mark_ready: "XÁC NHẬN SẴN SÀNG",
    ready: "ĐÃ SẴN SÀNG",
    initialize_battle: "KHỞI CHẠY CHIẾN DỊCH",
    kick_combatant: "Trục Xuất Đơn Vị",
    min_players_warning: "Cần tối thiểu 4 đơn vị để bắt đầu",
    waiting_for_all_ready: "Chờ tất cả đơn vị sẵn sàng",
    invite_friends: "Mời đồng minh vào khu vực này",
    room_settings: "Cấu Hình Khu Vực",
    commander_rank: "Xếp Hạng Chỉ Huy",

    // In-Game
    link_copied: "ĐÃ SAO CHÉP",
    link_copied_desc: "Liên kết mời đã được sao chép vào bộ nhớ tạm.",
    round_analysis: "Phân Tích Vòng Đấu",
    intel_report: "Bản Tin Tình Báo Đã Được Tổng Hợp",
    card_stars: "Thẻ bài",
    updated_rating: "Định Giá Mới",
    protocol_restarting: "Khởi Động Lại Giao Thức Trong",
    standings: "Bảng Xếp Hạng",
    logs: "Nhật Ký",
    element_clusters: "Nhóm Nguyên Tố",
    engagement_round: "Vòng Đối Đầu",
    time_remaining: "Thời Gian Còn Lại",
    commander_authorized: "CHỈ HUY ĐÃ XÁC THỰC",
    intel_uploading: "ĐANG TẢI DỮ LIỆU...",
    awaiting_clash: "Đang Chờ Xung Đột",
    tactical_guide: "Hướng Dẫn Chiến Thuật",
    my_inventory: "Kho Vũ Khí",
    modules: "Mô-đun",
    execute_deployment: "KÍCH HOẠT TRIỂN KHAI",
    waiting_for: "Đang chờ",
    victory_tally: "Bảng Vàng Chiến Thắng",
    protocol_terminated: "Phiên Giao Thức Đã Kết Thúc",
    arena_superior: "Bậc Thầy Đấu Trường",
    combatant: "Chiến Binh",
    redeploy_lobby: "QUAY LẠI PHÒNG CHỜ",
    exit_arena: "RỜI KHỎI ĐẤU TRƯỜNG",
    battle_archives: "Lưu Trữ Chiến Đấu",
    full_history: "Lịch Sử Đối Đầu Toàn Diện",
    archives_empty: "Dữ Liệu Trống",
    used: "Đã dùng",
  }
};
