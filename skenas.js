'use strict';
// Popierinės kortelės (DD 1380) nuotraukos atpažinimas – kodas vienodas ETC ir March giduose.
// Šablonas sugeneruotas iš DD Form 1380 (JUL 2025) PDF formos laukų koordinačių; tuščios kortelės vaizdai – img/skenas/.
const SK_TPL = { dd1380: {"id":"dd1380","name":"TCCC kortel\u0117 (DD 1380, 2025)","aspect":0.6811,"anchor":"border","sides":{"f":{"cb":{"ev_u":[0.3217,0.0672,0.3488,0.0857],"ev_p":[0.4779,0.0672,0.505,0.0857],"ev_r":[0.6439,0.0672,0.671,0.0857],"sex_m":[0.1069,0.1378,0.134,0.1563],"sex_f":[0.1996,0.1378,0.2267,0.1563],"m_art":[0.0385,0.2396,0.0656,0.2581],"m_blunt":[0.2338,0.2396,0.2609,0.2581],"m_burn":[0.3607,0.2396,0.3878,0.2581],"m_fall":[0.4877,0.2396,0.5148,0.2581],"m_gren":[0.6048,0.2396,0.632,0.2581],"m_gsw":[0.7708,0.2396,0.7979,0.2581],"m_ied":[0.8977,0.2396,0.9249,0.2581],"m_mine":[0.0385,0.2679,0.0656,0.2863],"m_mvc":[0.2338,0.2679,0.2609,0.2863],"m_rpg":[0.3607,0.2679,0.3878,0.2863],"m_other":[0.4877,0.2679,0.5148,0.2863]},"tx":{"roster":[0.4584,0.0338,0.8337,0.0569],"name":[0.2143,0.1073,0.7166,0.1304],"date":[0.5235,0.1356,0.7228,0.1587],"time":[0.8457,0.1356,0.9864,0.1587],"unit":[0.3803,0.1639,0.6189,0.187],"allerg":[0.8196,0.1639,0.9802,0.187],"m_other":[0.6244,0.2657,0.9802,0.2886],"tq_ra_type":[0.1275,0.373,0.2381,0.3961],"tq_ra_time":[0.1275,0.4013,0.2381,0.4243],"tq_rl_type":[0.1275,0.6917,0.2381,0.7146],"tq_rl_time":[0.1275,0.7199,0.2381,0.7428],"tq_la_type":[0.6059,0.373,0.7166,0.3961],"tq_la_time":[0.6059,0.4013,0.7166,0.4243],"tq_ll_type":[0.6059,0.6917,0.7166,0.7146],"tq_ll_time":[0.6059,0.7199,0.7166,0.7428],"v0_ts":[0.3607,0.8033,0.5066,0.8263],"v0_hr":[0.3607,0.8315,0.5066,0.8546],"v0_bp":[0.3607,0.8598,0.5066,0.8829],"v0_rr":[0.3607,0.888,0.5066,0.9111],"v0_spo2":[0.3607,0.9163,0.5066,0.9394],"v0_av":[0.355,0.9446,0.5123,0.9677],"v0_pain":[0.355,0.9728,0.5123,0.9959],"v1_ts":[0.5218,0.8033,0.6678,0.8263],"v1_hr":[0.5218,0.8315,0.6678,0.8546],"v1_bp":[0.5218,0.8598,0.6678,0.8829],"v1_rr":[0.5218,0.888,0.6678,0.9111],"v1_spo2":[0.5218,0.9163,0.6678,0.9394],"v1_av":[0.5161,0.9446,0.6734,0.9677],"v1_pain":[0.5161,0.9728,0.6734,0.9959],"v2_ts":[0.6829,0.8033,0.8289,0.8263],"v2_hr":[0.6829,0.8315,0.8289,0.8546],"v2_bp":[0.6829,0.8598,0.8289,0.8829],"v2_rr":[0.6829,0.888,0.8289,0.9111],"v2_spo2":[0.6829,0.9163,0.8289,0.9394],"v2_av":[0.6772,0.9446,0.8346,0.9677],"v2_pain":[0.6772,0.9728,0.8346,0.9959],"v3_ts":[0.844,0.8033,0.99,0.8263],"v3_hr":[0.844,0.8315,0.99,0.8546],"v3_bp":[0.844,0.8598,0.99,0.8829],"v3_rr":[0.844,0.888,0.99,0.9111],"v3_spo2":[0.844,0.9163,0.99,0.9394],"v3_av":[0.8384,0.9446,0.9957,0.9677],"v3_pain":[0.8384,0.9728,0.9957,0.9959]},"hot":[["Ant_Right_Shoulder","Ant_Rt_Arm",0.3127,0.4188],["Ant_Right_Lateral_Bicep","Ant_Rt_Arm",0.3045,0.457],["Ant_Right_Elbow","Ant_Rt_Arm",0.3044,0.4846],["Ant_Right_Proximal_Lateral_Forearm","Ant_Rt_Arm",0.2951,0.4979],["Ant_Right_Middle_Lateral_Forearm","Ant_Rt_Arm",0.2858,0.512],["Ant_Right_Distal_Lateral_Forearm","Ant_Rt_Arm",0.2788,0.5276],["Ant_Right_Proximal_Medial_Forearm","Ant_Rt_Arm",0.3133,0.4994],["Ant_Right_Middle_Medial_Forearm","Ant_Rt_Arm",0.3038,0.514],["Ant_Right_Distal_Medial_Forearm","Ant_Rt_Arm",0.2959,0.5288],["Ant_Right_Wrist","Ant_Rt_Arm",0.2818,0.5398],["Right_Palm","Ant_Rt_Arm",0.2777,0.5543],["Ant_Right_Thumb","Ant_Rt_Arm",0.2536,0.5592],["Ant_Right_Fingers","Ant_Rt_Arm",0.2744,0.5749],["Ant_Right_Medial_Bicep","Ant_Rt_Arm",0.3204,0.4679],["AnteriorHead","Ant_Head",0.3832,0.3539],["Nose","Ant_Head",0.3849,0.3745],["Mouth","Ant_Head",0.3849,0.3844],["Right_Eye","Ant_Head",0.37,0.3663],["Right_Ear","Ant_Head",0.349,0.3715],["Left_Ear","Ant_Head",0.421,0.3715],["Chin","Ant_Head",0.3849,0.3946],["AnteriorNeck","Ant_Head",0.3849,0.4059],["Left_Eye","Ant_Head",0.4001,0.3663],["Right_Cheek","Ant_Head",0.368,0.3797],["Left_Cheek","Ant_Head",0.4001,0.3797],["Right_Upper_Chest","Ant_Chest",0.3526,0.4194],["Left_Upper_Chest","Ant_Chest",0.4155,0.4194],["Sternum","Ant_Chest",0.3832,0.4537],["RUQ","Ant_Chest",0.3567,0.479],["Right_Lower_Chest","Ant_Chest",0.3537,0.4489],["LUQ","Ant_Chest",0.4054,0.479],["Left_Lower_Chest","Ant_Chest",0.4133,0.4489],["Left_Axillary","Ant_Chest",0.4396,0.4459],["Right_Axillary","Ant_Chest",0.325,0.4459],["RLQ","Ant_Abd",0.3627,0.5038],["Right_Flank","Ant_Abd",0.3377,0.5038],["LLQ","Ant_Abd",0.4054,0.5038],["Left_Flank","Ant_Abd",0.4278,0.5038],["Pelvis","Ant_Abd",0.3832,0.5278],["Right_Groin","Ant_Abd",0.3572,0.5321],["Left_Groin","Ant_Abd",0.4063,0.5321],["Right_Hip","Ant_Abd",0.3331,0.5376],["Left_Hip","Ant_Abd",0.4315,0.5376],["Genitals","Ant_Abd",0.3832,0.5633],["Ant_Left_Shoulder","Ant_Lft_Arm",0.4488,0.4188],["Ant_Left_Lateral_Bicep","Ant_Lft_Arm",0.4643,0.457],["Ant_Left_Elbow","Ant_Lft_Arm",0.4608,0.4846],["Ant_Left_Proximal_Lateral_Forearm","Ant_Lft_Arm",0.476,0.4979],["Ant_Left_Middle_Medial_Forearm","Ant_Lft_Arm",0.4638,0.514],["Ant_Left_Distal_Medial_Forearm","Ant_Lft_Arm",0.4738,0.5288],["Ant_Left_Wrist","Ant_Lft_Arm",0.4872,0.5398],["Left_Palm","Ant_Lft_Arm",0.4893,0.5543],["Ant_Left_Thumb","Ant_Lft_Arm",0.5148,0.5592],["Ant_Left_Fingers","Ant_Lft_Arm",0.4904,0.5749],["Ant_Left_Medial_Bicep","Ant_Lft_Arm",0.4467,0.4679],["Ant_Left_Middle_Lateral_Forearm","Ant_Lft_Arm",0.483,0.512],["Ant_Left_Distal_Lateral_Forearm","Ant_Lft_Arm",0.4912,0.5276],["Ant_Left_Proximal_Medial_Forearm","Ant_Lft_Arm",0.4546,0.4994],["Ant_Right_Middle_Lateral_Thigh","Ant_Rt_Leg",0.329,0.5741],["Ant_Right_Proximal_Medial_Thigh","Ant_Rt_Leg",0.368,0.5647],["Ant_Right_Middle_Medial_Thigh","Ant_Rt_Leg",0.37,0.5816],["Ant_Right_Knee","Ant_Rt_Leg",0.3518,0.6272],["Ant_Right_Proximal_Lateral_Lower_Leg","Ant_Rt_Leg",0.3403,0.6522],["Ant_Right_Middle_Lateral_Lower_Leg","Ant_Rt_Leg",0.3342,0.6745],["Ant_Right_Distal_Lateral_Lower_Leg","Ant_Rt_Leg",0.345,0.6968],["Ant_Right_Proximal_Medial_Lower_Leg","Ant_Rt_Leg",0.3608,0.6522],["Ant_Right_Middle_Medial_Lower_Leg","Ant_Rt_Leg",0.3585,0.6745],["Ant_Right_Distal_Medial_Lower_Leg","Ant_Rt_Leg",0.3627,0.6968],["Ant_Right_Ankle","Ant_Rt_Leg",0.3619,0.7166],["Ant_Right_Foot","Ant_Rt_Leg",0.361,0.7316],["Ant_Right_Big_Toe","Ant_Rt_Leg",0.3705,0.7403],["Ant_Right_Other_Toes","Ant_Rt_Leg",0.3496,0.7419],["Ant_Right_Distal_Lateral_Thigh","Ant_Rt_Leg",0.3349,0.5997],["Ant_Right_Distal_Medial_Thigh","Ant_Rt_Leg",0.3627,0.5997],["Ant_Right_Proximal_Lateral_Thigh","Ant_Rt_Leg",0.3281,0.5486],["Ant_Left_Middle_Lateral_Thigh","Ant_Lft_Leg",0.4396,0.5746],["Ant_Left_Proximal_Medial_Thigh","Ant_Lft_Leg",0.4008,0.5647],["Ant_Left_Middle_Medial_Thigh","Ant_Lft_Leg",0.3992,0.5816],["Ant_Left_Knee","Ant_Lft_Leg",0.4161,0.6281],["Ant_Left_Proximal_Lateral_Lower_Leg","Ant_Lft_Leg",0.4315,0.6522],["Ant_Left_Middle_Lateral_Lower_Leg","Ant_Lft_Leg",0.4313,0.6745],["Ant_Left_Distal_Lateral_Lower_Leg","Ant_Lft_Leg",0.4242,0.6968],["Ant_Left_Proximal_Medial_Lower_Leg","Ant_Lft_Leg",0.4073,0.6522],["Ant_Left_Middle_Medial_Lower_Leg","Ant_Lft_Leg",0.4073,0.6745],["Ant_Left_Distal_Medial_Lower_Leg","Ant_Lft_Leg",0.4052,0.6968],["Ant_Left_Ankle","Ant_Lft_Leg",0.4061,0.7166],["Ant_Left_Foot","Ant_Lft_Leg",0.4061,0.7316],["Ant_Left_Big_Toe","Ant_Lft_Leg",0.3932,0.7403],["Ant_Left_Other_Toes","Ant_Lft_Leg",0.4202,0.7419],["Ant_Left_Distal_Lateral_Thigh","Ant_Lft_Leg",0.4307,0.6002],["Ant_Left_Distal_Medial_Thigh","Ant_Lft_Leg",0.4033,0.5997],["Ant_Left_Proximal_Lateral_Thigh","Ant_Lft_Leg",0.4366,0.5486],["PosteriorHead","Post_Head_to_Butt",0.8536,0.3552],["PosteriorNeck","Post_Head_to_Butt",0.8536,0.3912],["Thoracic_Spine","Post_Head_to_Butt",0.8536,0.4473],["Lumbar_Spine","Post_Head_to_Butt",0.8536,0.4998],["Left_Upper_Back","Post_Head_to_Butt",0.821,0.4183],["Left_Middle_Back","Post_Head_to_Butt",0.821,0.4687],["Left_Lower_Back","Post_Head_to_Butt",0.821,0.5082],["Right_Upper_Back","Post_Head_to_Butt",0.8859,0.4183],["Right_Middle_Back","Post_Head_to_Butt",0.8859,0.4687],["Right_Lower_Back","Post_Head_to_Butt",0.8859,0.5082],["Tail_Bone","Post_Head_to_Butt",0.8536,0.5446],["Left_Buttock","Post_Head_to_Butt",0.8191,0.5414],["Right_Buttock","Post_Head_to_Butt",0.888,0.5414],["Post_Left_Shoulder","Post_Lft_Arm",0.7876,0.4211],["Post_Left_Lateral_Bicep","Post_Lft_Arm",0.7754,0.4531],["Post_Left_Medial_Bicep","Post_Lft_Arm",0.7903,0.4667],["Post_Left_Elbow","Post_Lft_Arm",0.7773,0.4821],["Post_Left_Proximal_Lateral_Forearm","Post_Lft_Arm",0.7599,0.493],["Post_Left_Middle_Lateral_Forearm","Post_Lft_Arm",0.753,0.5068],["Post_Left_Distal_Lateral_Forearm","Post_Lft_Arm",0.75,0.5206],["Post_Left_Proximal_Medial_Forearm","Post_Lft_Arm",0.7816,0.4951],["Post_Left_Middle_Medial_Forearm","Post_Lft_Arm",0.7776,0.5088],["Post_Left_Distal_Medial_Forearm","Post_Lft_Arm",0.7675,0.5233],["Post_Left_Wrist","Post_Lft_Arm",0.75,0.5344],["Left_Hand","Post_Lft_Arm",0.744,0.5525],["Post_Left_Fingers","Post_Lft_Arm",0.7377,0.5755],["Post_Left_Thumb","Post_Lft_Arm",0.7173,0.5601],["Post_Right_Shoulder","Post_Rt_Arm",0.9179,0.4211],["Post_Right_Lateral_Bicep","Post_Rt_Arm",0.9322,0.4531],["Post_Right_Medial_Bicep","Post_Rt_Arm",0.9181,0.4667],["Post_Right_Elbow","Post_Rt_Arm",0.9303,0.4837],["Post_Right_Proximal_Lateral_Forearm","Post_Rt_Arm",0.9466,0.4971],["Post_Right_Middle_Lateral_Forearm","Post_Rt_Arm",0.9506,0.511],["Post_Right_Distal_Lateral_Forearm","Post_Rt_Arm",0.9577,0.5249],["Post_Right_Proximal_Medial_Forearm","Post_Rt_Arm",0.9251,0.4991],["Post_Right_Middle_Medial_Forearm","Post_Rt_Arm",0.9332,0.5132],["Post_Right_Distal_Medial_Forearm","Post_Rt_Arm",0.9414,0.5283],["Post_Right_Wrist","Post_Rt_Arm",0.9577,0.5387],["Right_Hand","Post_Rt_Arm",0.9599,0.5525],["Post_Right_Thumb","Post_Rt_Arm",0.9843,0.5601],["Post_Right_Fingers","Post_Rt_Arm",0.9628,0.5755],["Post_Left_Proximal_Lateral_Thigh","Post_Lft_Leg",0.7976,0.5685],["Post_Left_Middle_Lateral_Thigh","Post_Lft_Leg",0.8055,0.5928],["Post_Left_Distal_Lateral_Thigh","Post_Lft_Leg",0.8129,0.617],["Post_Left_Proximal_Medial_Thigh","Post_Lft_Leg",0.8397,0.5713],["Post_Left_Middle_Medial_Thigh","Post_Lft_Leg",0.8397,0.5928],["Post_Left_Distal_Medial_Thigh","Post_Lft_Leg",0.8357,0.617],["Post_Left_Knee","Post_Lft_Leg",0.8191,0.6361],["Post_Left_Proximal_Lateral_Lower_Leg","Post_Lft_Leg",0.8088,0.6559],["Post_Left_Middle_Lateral_Lower_Leg","Post_Lft_Leg",0.8107,0.6796],["Post_Left_Distal_Lateral_Lower_Leg","Post_Lft_Leg",0.8158,0.7046],["Post_Left_Proximal_Medial_Lower_Leg","Post_Lft_Leg",0.8283,0.6559],["Post_Left_Middle_Medial_Lower_Leg","Post_Lft_Leg",0.8302,0.6796],["Post_Left_Distal_Medial_Lower_Leg","Post_Lft_Leg",0.8302,0.7046],["Post_Left_Ankle","Post_Lft_Leg",0.8299,0.7268],["Left_Heel","Post_Lft_Leg",0.8299,0.7425],["Post_Right_Proximal_Lateral_Thigh","Post_Rt_Leg",0.9045,0.5685],["Post_Right_Middle_Lateral_Thigh","Post_Rt_Leg",0.8985,0.5928],["Post_Right_Distal_Lateral_Thigh","Post_Rt_Leg",0.8915,0.617],["Post_Right_Proximal_Medial_Thigh","Post_Rt_Leg",0.8679,0.5713],["Post_Right_Middle_Medial_Thigh","Post_Rt_Leg",0.8699,0.5928],["Post_Right_Distal_Medial_Thigh","Post_Rt_Leg",0.8725,0.617],["Post_Right_Knee","Post_Rt_Leg",0.8809,0.6361],["Post_Right_Proximal_Lateral_Lower_Leg","Post_Rt_Leg",0.8953,0.6559],["Post_Right_Middle_Lateral_Lower_Leg","Post_Rt_Leg",0.8934,0.6796],["Post_Right_Distal_Lateral_Lower_Leg","Post_Rt_Leg",0.8861,0.7046],["Post_Right_Proximal_Medial_Lower_Leg","Post_Rt_Leg",0.8777,0.6559],["Post_Right_Middle_Medial_Lower_Leg","Post_Rt_Leg",0.8736,0.6796],["Post_Right_Distal_Medial_Lower_Leg","Post_Rt_Leg",0.8696,0.7046],["Post_Right_Ankle","Post_Rt_Leg",0.872,0.7268],["Right_Heel","Post_Rt_Leg",0.872,0.7425]]},"b":{"cb":{"ev_u":[0.3217,0.0429,0.3488,0.0613],"ev_p":[0.4779,0.0429,0.505,0.0613],"ev_r":[0.6439,0.0429,0.671,0.0613],"tq_ext":[0.1305,0.1079,0.1576,0.1264],"tq_jun":[0.3062,0.1079,0.3333,0.1264],"tq_tru":[0.5015,0.1079,0.5286,0.1264],"dr_hem":[0.2135,0.1362,0.2406,0.1546],"dr_pre":[0.4185,0.1362,0.4456,0.1546],"dr_oth":[0.5943,0.1362,0.6214,0.1546],"a_int":[0.067,0.1644,0.0941,0.1829],"a_npa":[0.189,0.1644,0.2162,0.1829],"a_cric":[0.2964,0.1644,0.3236,0.1829],"a_ett":[0.4185,0.1644,0.4456,0.1829],"a_sga":[0.5943,0.1644,0.6214,0.1829],"b_o2":[0.067,0.1927,0.0941,0.2112],"b_nd":[0.1549,0.1927,0.182,0.2112],"b_ct":[0.3209,0.1927,0.348,0.2112],"b_cs":[0.5259,0.1927,0.553,0.2112],"o_cpp":[0.1557,0.6846,0.1828,0.7031],"o_eye":[0.4486,0.6846,0.4757,0.7031],"o_eye_r":[0.6634,0.6846,0.6905,0.7031],"o_eye_l":[0.7415,0.6846,0.7686,0.7031],"o_spl":[0.8196,0.6846,0.8468,0.7031],"o_hypo":[0.0873,0.7129,0.1145,0.7314]},"tx":{"t_tq":[0.7415,0.1057,0.9802,0.1288],"t_dr":[0.7415,0.1339,0.9802,0.157],"t_a":[0.7415,0.1622,0.9802,0.1853],"t_b":[0.7415,0.1905,0.9802,0.2136],"fl0":[0.2777,0.2583,0.99,0.2869],"fl0_n":[0.2777,0.2583,0.5652,0.2869],"fl0_d":[0.5804,0.2583,0.7068,0.2869],"fl0_r":[0.722,0.2583,0.8484,0.2869],"fl0_t":[0.8636,0.2583,0.99,0.2869],"fl1":[0.2777,0.2923,0.99,0.3209],"fl1_n":[0.2777,0.2923,0.5652,0.3209],"fl1_d":[0.5804,0.2923,0.7068,0.3209],"fl1_r":[0.722,0.2923,0.8484,0.3209],"fl1_t":[0.8636,0.2923,0.99,0.3209],"bl0":[0.2777,0.3261,0.99,0.3549],"bl0_n":[0.2777,0.3261,0.5652,0.3549],"bl0_d":[0.5804,0.3261,0.7068,0.3549],"bl0_r":[0.722,0.3261,0.8484,0.3549],"bl0_t":[0.8636,0.3261,0.99,0.3549],"bl1":[0.2777,0.3601,0.99,0.3887],"bl1_n":[0.2777,0.3601,0.5652,0.3887],"bl1_d":[0.5804,0.3601,0.7068,0.3887],"bl1_r":[0.722,0.3601,0.8484,0.3887],"bl1_t":[0.8636,0.3601,0.99,0.3887],"an0":[0.2777,0.4336,0.99,0.4622],"an0_n":[0.2777,0.4336,0.5652,0.4622],"an0_d":[0.5804,0.4336,0.7068,0.4622],"an0_r":[0.722,0.4336,0.8484,0.4622],"an0_t":[0.8636,0.4336,0.99,0.4622],"an1":[0.2777,0.4674,0.99,0.4962],"an1_n":[0.2777,0.4674,0.5652,0.4962],"an1_d":[0.5804,0.4674,0.7068,0.4962],"an1_r":[0.722,0.4674,0.8484,0.4962],"an1_t":[0.8636,0.4674,0.99,0.4962],"an2":[0.2777,0.5014,0.99,0.53],"an2_n":[0.2777,0.5014,0.5652,0.53],"an2_d":[0.5804,0.5014,0.7068,0.53],"an2_r":[0.722,0.5014,0.8484,0.53],"an2_t":[0.8636,0.5014,0.99,0.53],"ab0":[0.2777,0.5354,0.99,0.564],"ab0_n":[0.2777,0.5354,0.5652,0.564],"ab0_d":[0.5804,0.5354,0.7068,0.564],"ab0_r":[0.722,0.5354,0.8484,0.564],"ab0_t":[0.8636,0.5354,0.99,0.564],"ab1":[0.2777,0.5692,0.99,0.5978],"ab1_n":[0.2777,0.5692,0.5652,0.5978],"ab1_d":[0.5804,0.5692,0.7068,0.5978],"ab1_r":[0.722,0.5692,0.8484,0.5978],"ab1_t":[0.8636,0.5692,0.99,0.5978],"ot0":[0.2777,0.6032,0.99,0.6318],"ot0_n":[0.2777,0.6032,0.5652,0.6318],"ot0_d":[0.5804,0.6032,0.7068,0.6318],"ot0_r":[0.722,0.6032,0.8484,0.6318],"ot0_t":[0.8636,0.6032,0.99,0.6318],"ot1":[0.2777,0.637,0.99,0.6658],"ot1_n":[0.2777,0.637,0.5652,0.6658],"ot1_d":[0.5804,0.637,0.7068,0.6658],"ot1_r":[0.722,0.637,0.8484,0.6658],"ot1_t":[0.8636,0.637,0.99,0.6658],"o_type":[0.556,0.7105,0.9802,0.7336],"notes":[0.0092,0.7728,0.99,0.937]}}},"img":{"f":"img/skenas/dd1380-f.png","b":"img/skenas/dd1380-b.png"},"body":{"Ant":[0.22,0.335,0.555,0.765],"Post":[0.695,0.335,0.993,0.765]}} };

// ───────── Popierinės kortelės nuotraukos atpažinimas (SK) – veikia be interneto ─────────
// Eiga: nuotrauka → kortelės kampai (automatiškai, galima pataisyti) → ištiesinimas pagal šabloną → sulyginimas su tuščia kortele →
// varnelės langeliuose, rašto buvimas laukuose, X žymės ant kūno schemos → iškarpos šalia laukų → peržiūra → nauja MIST kortelė.
// Rašytas tekstas neatpažįstamas: medikas jį suveda žiūrėdamas į iškarpą. Nuotraukos niekur nesaugomos.
const SK = (() => {
  const WN = 800; // ištiesinto vaizdo plotis
  const S = { tpl: 'dd1380', side: 'f', src: null, q: null, busy: false, res: {}, form: null, err: '' };
  const T = () => SK_TPL[S.tpl];
  const H = () => Math.round(WN / T().aspect);
  // ── pagalbinės ──
  function loadImg(src) { return new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src; }); }
  function toCanvas(img, max) {
    const k = Math.min(1, max / Math.max(img.naturalWidth || img.width, img.naturalHeight || img.height));
    const c = document.createElement('canvas'); c.width = Math.round((img.naturalWidth || img.width) * k); c.height = Math.round((img.naturalHeight || img.height) * k);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); return c;
  }
  function gray(c) { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data, g = new Uint8ClampedArray(c.width * c.height); for (let i = 0, j = 0; i < g.length; i++, j += 4) g[i] = (d[j] * 77 + d[j + 1] * 150 + d[j + 2] * 29) >> 8; return g; }
  function integral(g, w, h) { const I = new Float64Array((w + 1) * (h + 1)); for (let y = 0; y < h; y++) { let s = 0; for (let x = 0; x < w; x++) { s += g[y * w + x]; I[(y + 1) * (w + 1) + x + 1] = I[y * (w + 1) + x + 1] + s; } } return I; }
  const boxMean = (I, w, h, x, y, r) => { const x0 = Math.max(0, x - r), y0 = Math.max(0, y - r), x1 = Math.min(w, x + r + 1), y1 = Math.min(h, y + r + 1), W1 = w + 1; return (I[y1 * W1 + x1] - I[y0 * W1 + x1] - I[y1 * W1 + x0] + I[y0 * W1 + x0]) / ((x1 - x0) * (y1 - y0)); };
  // ── homografija: 4 taškai (šaltinis) ↔ stačiakampis (paskirtis) ──
  function solve(A, b) { const n = b.length; for (let i = 0; i < n; i++) { let p = i; for (let r = i + 1; r < n; r++) if (Math.abs(A[r][i]) > Math.abs(A[p][i])) p = r; [A[i], A[p]] = [A[p], A[i]]; [b[i], b[p]] = [b[p], b[i]]; for (let r = i + 1; r < n; r++) { const f = A[r][i] / A[i][i]; for (let c = i; c < n; c++) A[r][c] -= f * A[i][c]; b[r] -= f * b[i]; } } const x = new Array(n); for (let i = n - 1; i >= 0; i--) { let s = b[i]; for (let c = i + 1; c < n; c++) s -= A[i][c] * x[c]; x[i] = s / A[i][i]; } return x; }
  function homog(from, to) { const A = [], b = []; for (let i = 0; i < 4; i++) { const [x, y] = from[i], [u, v] = to[i]; A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.push(u); A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); b.push(v); } const h = solve(A, b); return [h[0], h[1], h[2], h[3], h[4], h[5], h[6], h[7], 1]; }
  function warp(src, q, W, Hh) {
    const sw = src.width, sh = src.height, g = gray(src), M = homog([[0, 0], [W, 0], [W, Hh], [0, Hh]], q), out = new Uint8ClampedArray(W * Hh);
    for (let y = 0; y < Hh; y++) for (let x = 0; x < W; x++) {
      const X = x + .5, Y = y + .5, z = M[6] * X + M[7] * Y + M[8], u = (M[0] * X + M[1] * Y + M[2]) / z - .5, v = (M[3] * X + M[4] * Y + M[5]) / z - .5;
      const x0 = Math.floor(u), y0 = Math.floor(v), fx = u - x0, fy = v - y0;
      if (x0 < 0 || y0 < 0 || x0 >= sw - 1 || y0 >= sh - 1) { out[y * W + x] = 255; continue; }
      const i = y0 * sw + x0;
      out[y * W + x] = (g[i] * (1 - fx) + g[i + 1] * fx) * (1 - fy) + (g[i + sw] * (1 - fx) + g[i + sw + 1] * fx) * fy;
    }
    return out;
  }
  // ── kortelės kampai: didžiausia tamsi jungtinė sritis (storas rėmelis su vidinėmis linijomis) arba šviesus popierius ──
  function autoCorners(c, anchor) {
    const k = Math.min(1, 640 / Math.max(c.width, c.height)), w = Math.round(c.width * k), h = Math.round(c.height * k);
    const t = document.createElement('canvas'); t.width = w; t.height = h; t.getContext('2d').drawImage(c, 0, 0, w, h);
    const g = gray(t), N = w * h, I = integral(g, w, h);
    // 1) popierius: šviesi sritis (Otsu slenkstis), didžiausia jungtinė dalis
    const hist = new Array(256).fill(0); for (let i = 0; i < N; i++) hist[g[i]]++;
    let sum = 0; for (let i = 0; i < 256; i++) sum += i * hist[i];
    let sB = 0, wB = 0, best = 0, thr = 128; for (let i = 0; i < 256; i++) { wB += hist[i]; if (!wB) continue; const wF = N - wB; if (!wF) break; sB += i * hist[i]; const mB = sB / wB, mF = (sum - sB) / wF, v = wB * wF * (mB - mF) ** 2; if (v > best) { best = v; thr = i; } }
    function comps(mask, minArea) {
      const lab = new Int32Array(N), st = []; let out = null, n = 0;
      for (let p = 0; p < N; p++) {
        if (!mask[p] || lab[p]) continue;
        n++; st.length = 0; st.push(p); lab[p] = n; let cnt = 0, x0 = w, y0 = h, x1 = 0, y1 = 0, a = [1e9, 0], b = [-1e9, 0], cc = [-1e9, 0], d = [1e9, 0];
        while (st.length) {
          const q = st.pop(), x = q % w, y = (q - x) / w; cnt++;
          if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
          if (x + y < a[0]) a = [x + y, q]; if (x - y > b[0]) b = [x - y, q]; if (x + y > cc[0]) cc = [x + y, q]; if (x - y < d[0]) d = [x - y, q];
          for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue; const r = yy * w + xx; if (mask[r] && !lab[r]) { lab[r] = n; st.push(r); } }
        }
        const area = (x1 - x0) * (y1 - y0);
        if (area > N * minArea && (!out || area > out.area)) out = { area, lab: n, pts: [a[1], b[1], cc[1], d[1]] };
      }
      return out ? Object.assign(out, { labs: lab }) : null;
    }
    const bright = new Uint8Array(N); for (let i = 0; i < N; i++) bright[i] = g[i] > thr ? 1 : 0;
    const paper = comps(bright, 0.08);
    const toSrc = pts => pts.map(q => [(q % w + .5) / k, (Math.floor(q / w) + .5) / k]);
    const fallback = () => { const m = 0.1; return [[c.width * m, c.height * m], [c.width * (1 - m), c.height * m], [c.width * (1 - m), c.height * (1 - m)], [c.width * m, c.height * (1 - m)]]; };
    if (!paper) return fallback();
    if (anchor === 'paper') return toSrc(paper.pts);
    // 2) storas rėmelis popieriaus viduje: tamsios linijos tik ten, kur aplink – popierius (be fono pakraščių)
    // popieriaus kaukė be skylių: fonas = tai, kas pasiekiama nuo vaizdo kraštų nepereinant popieriaus
    const P = new Uint8Array(N).fill(1), st = [];
    const push = q => { if (P[q] && paper.labs[q] !== paper.lab) { P[q] = 0; st.push(q); } };
    for (let x = 0; x < w; x++) { push(x); push((h - 1) * w + x); }
    for (let y = 0; y < h; y++) { push(y * w); push(y * w + w - 1); }
    while (st.length) { const q = st.pop(), x = q % w, y = (q - x) / w; if (x > 0) push(q - 1); if (x < w - 1) push(q + 1); if (y > 0) push(q - w); if (y < h - 1) push(q + w); }
    const IP = integral(P, w, h), dark = new Uint8Array(N);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = y * w + x; if (boxMean(IP, w, h, x, y, 5) < 0.7) continue; // per arti popieriaus krašto ar už jo
      const m = boxMean(I, w, h, x, y, 12); dark[i] = g[i] < m - 18 && g[i] < 170 ? 1 : 0;
    }
    const border = comps(dark, 0.10);
    return toSrc(border ? border.pts : paper.pts);
  }
  // ── tuščios kortelės šablonas (tamsumas) ──
  const tplCache = {};
  async function tplDark(side) {
    const key = S.tpl + side; if (tplCache[key]) return tplCache[key];
    const img = await loadImg(T().img[side]), W = WN, Hh = H(), c = document.createElement('canvas'); c.width = W; c.height = Hh;
    c.getContext('2d').drawImage(img, 0, 0, W, Hh);
    const g = gray(c), m = new Uint8Array(W * Hh); for (let i = 0; i < g.length; i++) m[i] = g[i] < 175 ? 1 : 0;
    const dl = new Uint8Array(W * Hh), R = 2; // išplėsta kaukė (spausdintos linijos ± 2 px)
    for (let y = 0; y < Hh; y++) for (let x = 0; x < W; x++) { if (!m[y * W + x]) continue; for (let dy = -R; dy <= R; dy++) { const yy = y + dy; if (yy < 0 || yy >= Hh) continue; for (let dx = -R; dx <= R; dx++) { const xx = x + dx; if (xx >= 0 && xx < W) dl[yy * W + xx] = 1; } } }
    return (tplCache[key] = { m, dl });
  }
  // ── analizė ──
  async function analyse(side) {
    const W = WN, Hh = H(), g = warp(S.src, S.q, W, Hh), I = integral(g, W, Hh), dk = new Uint8Array(W * Hh);
    for (let y = 0; y < Hh; y++) for (let x = 0; x < W; x++) { const bg = Math.max(60, boxMean(I, W, Hh, x, y, 18)); dk[y * W + x] = g[y * W + x] < bg * 0.72 ? 1 : 0; }
    const TP = await tplDark(side);
    // poslinkis tarp nuotraukos ir šablono (kampai nebūna tikslūs): visam vaizdui, tada 3 × 3 sritims – vietinis poslinkių laukas
    const corr = (dx, dy, st, X0, Y0, X1, Y1) => { let s = 0; for (let y = Math.max(24, Y0); y < Math.min(Hh - 24, Y1); y += st) { const yy = y + dy; if (yy < 0 || yy >= Hh) continue; const r = y * W, rr = yy * W; for (let x = Math.max(24, X0); x < Math.min(W - 24, X1); x += st) { const xx = x + dx; if (xx >= 0 && xx < W && dk[r + x] && TP.m[rr + xx]) s++; } } return s; };
    function bestShift(cx, cy, R, X0, Y0, X1, Y1) {
      let bx = cx, by = cy, bs = -1;
      for (let dy = cy - R; dy <= cy + R; dy += 3) for (let dx = cx - R; dx <= cx + R; dx += 3) { const s = corr(dx, dy, 3, X0, Y0, X1, Y1); if (s > bs) { bs = s; bx = dx; by = dy; } }
      const gx = bx, gy = by; bs = -1;
      for (let dy = gy - 2; dy <= gy + 2; dy++) for (let dx = gx - 2; dx <= gx + 2; dx++) { const s = corr(dx, dy, 2, X0, Y0, X1, Y1); if (s > bs) { bs = s; bx = dx; by = dy; } }
      return [bx, by, bs];
    }
    const G = bestShift(0, 0, 24, 0, 0, W, Hh), NG = 3, grid = [];
    for (let j = 0; j < NG; j++) for (let i = 0; i < NG; i++) {
      const X0 = Math.round(i * W / NG), X1 = Math.round((i + 1) * W / NG), Y0 = Math.round(j * Hh / NG), Y1 = Math.round((j + 1) * Hh / NG);
      let tc = 0; for (let y = Y0; y < Y1; y += 2) for (let x = X0; x < X1; x += 2) tc += TP.m[y * W + x];
      grid.push(tc > 400 ? bestShift(G[0], G[1], 12, X0, Y0, X1, Y1) : [G[0], G[1], 0]);
    }
    // poslinkis taške (bilinijinė interpoliacija tarp sričių centrų)
    const shiftAt = (x, y) => {
      const fx = Math.max(0, Math.min(NG - 1, x / (W / NG) - .5)), fy = Math.max(0, Math.min(NG - 1, y / (Hh / NG) - .5));
      const i0 = Math.min(NG - 2, Math.floor(fx)), j0 = Math.min(NG - 2, Math.floor(fy)), ax = fx - i0, ay = fy - j0;
      const g00 = grid[j0 * NG + i0], g10 = grid[j0 * NG + i0 + 1], g01 = grid[(j0 + 1) * NG + i0], g11 = grid[(j0 + 1) * NG + i0 + 1];
      return [0, 1].map(k => (g00[k] * (1 - ax) + g10[k] * ax) * (1 - ay) + (g01[k] * (1 - ax) + g11[k] * ax) * ay);
    };
    // rašalas = tamsu nuotraukoje ir ne spausdinta šablone
    const ink = new Uint8Array(W * Hh);
    for (let y = 0; y < Hh; y++) for (let x = 0; x < W; x += 8) {
      const [sx, sy] = shiftAt(x + 4, y), yy = Math.round(y + sy), dxr = Math.round(sx); if (yy < 0 || yy >= Hh) continue;
      for (let k = x; k < Math.min(W, x + 8); k++) { const xx = k + dxr; if (xx < 0 || xx >= W) continue; if (dk[y * W + k] && !TP.dl[yy * W + xx]) ink[y * W + k] = 1; }
    }
    // šablono stačiakampis → nuotraukos pikseliai (poslinkis pagal stačiakampio centrą)
    const px = r => { const cx = (r[0] + r[2]) / 2 * W, cy = (r[1] + r[3]) / 2 * Hh; let [sx, sy] = shiftAt(cx - G[0], cy - G[1]); [sx, sy] = shiftAt(cx - sx, cy - sy); return [Math.round(r[0] * W - sx), Math.round(r[1] * Hh - sy), Math.round(r[2] * W - sx), Math.round(r[3] * Hh - sy)]; };
    const frac = (r, sx, sy) => { let [x0, y0, x1, y1] = px(r); const iw = x1 - x0, ih = y1 - y0; x0 += Math.round(iw * sx); x1 -= Math.round(iw * sx); y0 += Math.round(ih * sy); y1 -= Math.round(ih * sy); let s = 0, n = 0; for (let y = Math.max(0, y0); y < Math.min(Hh, y1); y++) for (let x = Math.max(0, x0); x < Math.min(W, x1); x++) { n++; s += ink[y * W + x]; } return n ? s / n : 0; };
    const bx = G[0], by = G[1];
    const sd = T().sides[side], cb = {}, tx = {};
    // langelis: tiksli vieta – kur nuotraukoje tamsiausias kvadrato kontūras (± 6 px), tada rašalas vidinėje dalyje
    const boxFrac = r => {
      const [x0, y0, x1, y1] = px(r), bw = x1 - x0, bh = y1 - y0; let bo = [0, 0], bs = -1;
      for (let oy = -6; oy <= 6; oy++) for (let ox = -6; ox <= 6; ox++) {
        let s = 0; const X0 = x0 + ox, Y0 = y0 + oy, X1 = x1 + ox, Y1 = y1 + oy;
        if (X0 < 1 || Y0 < 1 || X1 >= W - 1 || Y1 >= Hh - 1) continue;
        for (let x = X0; x <= X1; x++) s += dk[Y0 * W + x] + dk[Y1 * W + x];
        for (let y = Y0; y <= Y1; y++) s += dk[y * W + X0] + dk[y * W + X1];
        if (s > bs) { bs = s; bo = [ox, oy]; }
      }
      let s = 0, n = 0; const ix = Math.round(bw * 0.22), iy = Math.round(bh * 0.22);
      for (let y = y0 + bo[1] + iy; y < y1 + bo[1] - iy; y++) for (let x = x0 + bo[0] + ix; x < x1 + bo[0] - ix; x++) { if (x < 0 || y < 0 || x >= W || y >= Hh) continue; n++; s += dk[y * W + x]; }
      return n ? s / n : 0;
    };
    Object.keys(sd.cb || {}).forEach(k => { const f = boxFrac(sd.cb[k]); cb[k] = { on: f > 0.08, unsure: f > 0.04 && f <= 0.08, f: Math.round(f * 1000) / 1000 }; });
    Object.keys(sd.tx || {}).forEach(k => { const f = frac(sd.tx[k], 0.03, 0.12); tx[k] = Math.round(f * 1000) / 1000; });
    // X žymės ant kūno schemos (tik priekyje): rašalo dėmės kūno srityse, ne turniketų laukuose
    const marks = [];
    if (sd.hot && T().body) {
      const excl = Object.keys(sd.tx).filter(k => /^tq_/.test(k)).map(k => px(sd.tx[k]));
      Object.keys(T().body).forEach(grp => {
        const [x0, y0, x1, y1] = px(T().body[grp]), seen = new Uint8Array(W * Hh), comps = [];
        for (let y = Math.max(0, y0); y < Math.min(Hh, y1); y++) for (let x = Math.max(0, x0); x < Math.min(W, x1); x++) {
          const p = y * W + x; if (!ink[p] || seen[p]) continue;
          if (excl.some(e => x >= e[0] - 4 && x <= e[2] + 4 && y >= e[1] - 4 && y <= e[3] + 4)) continue;
          const st = [p]; seen[p] = 1; let n = 0, sx = 0, sy = 0, a = x, b = y, c2 = x, d2 = y;
          while (st.length) { const q = st.pop(), qx = q % W, qy = (q - qx) / W; n++; sx += qx; sy += qy; if (qx < a) a = qx; if (qx > c2) c2 = qx; if (qy < b) b = qy; if (qy > d2) d2 = qy;
            for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) { const xx = qx + dx, yy = qy + dy; if (xx < x0 || yy < y0 || xx >= x1 || yy >= y1) continue; const r = yy * W + xx; if (ink[r] && !seen[r]) { seen[r] = 1; st.push(r); } } }
          if (n >= 14 && (c2 - a >= 6 || d2 - b >= 6)) comps.push({ n, cx: sx / n, cy: sy / n, w: c2 - a, h: d2 - b });
        }
        comps.forEach(cm => {
          const [msx, msy] = shiftAt(cm.cx, cm.cy), u = (cm.cx + msx) / W, v = (cm.cy + msy) / Hh; let best = null, bd = 1e9;
          sd.hot.forEach(hh => { if (!hh[1].startsWith(grp)) return; const d = (hh[2] - u) ** 2 + ((hh[3] - v) / T().aspect) ** 2; if (d < bd) { bd = d; best = hh; } });
          if (best) marks.push({ name: best[0], grp: best[1], u, v, n: cm.n });
        });
      });
    }
    // ištiesintas vaizdas (kontrastas) – iškarpoms
    const cv = document.createElement('canvas'); cv.width = W; cv.height = Hh;
    const ctx = cv.getContext('2d'), id = ctx.createImageData(W, Hh);
    for (let i = 0; i < W * Hh; i++) { const v = Math.max(0, Math.min(255, (g[i] - 40) * 1.35)); id.data[i * 4] = id.data[i * 4 + 1] = id.data[i * 4 + 2] = v; id.data[i * 4 + 3] = 255; }
    ctx.putImageData(id, 0, 0);
    return { cb, tx, marks, shift: [bx, by], px, cv, url: cv.toDataURL('image/jpeg', 0.75) };
  }
  // ── iškarpa iš ištiesinto vaizdo ──
  function crop(r, keys, padY) {
    const R = S.res[keys], W = WN, Hh = H(); if (!R) return '';
    const p = padY == null ? 0.25 : padY;
    let [x0, y0, x1, y1] = R.px(r); const hh = y1 - y0;
    x0 = Math.max(0, x0 - 6); x1 = Math.min(W, x1 + 6); y0 = Math.max(0, y0 - hh * p); y1 = Math.min(Hh, y1 + hh * p * 0.6);
    const c = document.createElement('canvas'), k = Math.min(2, 560 / Math.max(1, x1 - x0)); c.width = Math.max(1, Math.round((x1 - x0) * k)); c.height = Math.max(1, Math.round((y1 - y0) * k));
    c.getContext('2d').drawImage(R.cv, x0, y0, x1 - x0, y1 - y0, 0, 0, c.width, c.height);
    return c.toDataURL('image/jpeg', 0.8);
  }
  const uni = (a, b) => [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[2], b[2]), Math.max(a[3], b[3])];
  // ── žymių vietos MIST kūno schemoje (120 × 250; priekis – paciento dešinė ekrano kairėje) ──
  const CAN = { head: [60, 18], neck: [60, 40], chest: { R: [50, 68], L: [70, 68], M: [60, 68] }, abd: { R: [52, 104], L: [68, 104], M: [60, 104] }, pelvis: { R: [51, 128], L: [69, 128], M: [60, 131] },
    back: { R: [50, 68], L: [70, 68], M: [60, 68] }, lback: { R: [52, 104], L: [68, 104], M: [60, 104] }, butt: { R: [52, 128], L: [68, 128], M: [60, 126] },
    shoulder: { R: [36, 54], L: [84, 54] }, uarm: { R: [29, 82], L: [91, 82] }, farm: { R: [23, 118], L: [97, 118] }, hand: { R: [17, 148], L: [103, 148] },
    thigh: { R: [48, 160], L: [72, 160] }, lleg: { R: [48, 205], L: [72, 205] }, foot: { R: [47.5, 234], L: [72.5, 234] } };
  function cat(nm) {
    const R = [[/Head|Nose|Mouth|Eye|Ear|Chin|Cheek/, 'head'], [/Neck/, 'neck'], [/Shoulder/, 'shoulder'], [/Bicep|Elbow/, 'uarm'], [/Forearm|Wrist/, 'farm'], [/Palm|Hand|Thumb|Finger/, 'hand'],
      [/Thigh|Knee/, 'thigh'], [/Lower_Leg|Ankle/, 'lleg'], [/Foot|Toe|Heel/, 'foot'], [/Buttock|Tail/, 'butt'], [/Lower_Back|Lumbar/, 'lback'], [/Upper_Back|Middle_Back|Thoracic/, 'back'],
      [/Chest|Sternum|Axillary/, 'chest'], [/RUQ|LUQ|RLQ|LLQ|Flank/, 'abd'], [/Pelvis|Groin|Hip|Genital/, 'pelvis']];
    const c = (R.find(r => r[0].test(nm)) || [0, 'chest'])[1];
    return c;
  }
  // DD 1380 žymė → { s: 'f' | 'b', x, y } MIST schemoje
  function markPos(m) {
    const back = m.grp.startsWith('Post'), c = cat(m.name), side = /Right|^R[UL]Q|Rt_/.test(m.name + ' ' + m.grp) ? 'R' : /Left|^L[UL]Q|Lft_/.test(m.name + ' ' + m.grp) ? 'L' : 'M';
    let p = CAN[c]; if (!Array.isArray(p)) p = p[side] || p.M || p.R;
    let [x, y] = p; if (back && side !== 'M') x = 120 - x; // nugaroje paciento dešinė – ekrano dešinėje
    return { s: back ? 'b' : 'f', x, y };
  }
  // ── formos (peržiūros) užpildymas iš analizės ──
  const MECH_MAP = { gsw: ['Šautinė žaizda'], blunt: ['Bukas sužalojimas'], burn: ['Nudegimas'], fall: ['Kritimas'], mvc: ['Eismo įvykis'], art: ['Sprogimas', 'artilerija'], gren: ['Sprogimas', 'granata'], ied: ['Sprogimas', 'SSU'], mine: ['Sprogimas', 'mina'], rpg: ['Sprogimas', 'RPG'], other: ['Kita'] };
  const TQL = [['ra', 'Dešinė ranka', [24, 100]], ['la', 'Kairė ranka', [96, 100]], ['rl', 'Dešinė koja', [48, 165]], ['ll', 'Kairė koja', [72, 165]]];
  const EVAC = [['u', 'Skubi (Urgent)'], ['p', 'Prioritetinė (Priority)'], ['r', 'Įprastinė (Routine)']];
  const TXB = [['tq_ext', 'Turniketas galūnei', 'tq'], ['tq_jun', 'Jungties turniketas', 'tq', 'jungties turniketas'], ['tq_tru', 'Liemens turniketas', 'tq', 'liemens turniketas'], ['dr_hem', 'Hemostatinis tvarstis', 'pack'], ['dr_pre', 'Spaudžiamasis tvarstis', 'press'], ['dr_oth', 'Kitas tvarstis', '', 'kitas tvarstis'],
    ['a_npa', 'NPA', 'aw', 'NPA'], ['a_cric', 'Krikotiroidotomija', 'aw', 'krikotiroidotomija'], ['a_ett', 'Intubacija', 'aw', 'intubacija'], ['a_sga', 'Supraglotinė priemonė', 'aw', 'SGA'], ['b_o2', 'Deguonis', '', 'O₂'], ['b_nd', 'Adatinė dekompresija', 'dec'], ['b_ct', 'Krūtinės drenas', 'dec', 'krūtinės drenas'], ['b_cs', 'Krūtinės lipdukas', 'occl'],
    ['o_cpp', 'CWMP (tabletės)', 'an', 'CWMP'], ['o_eye', 'Akies skydelis', '', 'akies skydelis'], ['o_spl', 'Įtvaras', 'spl'], ['o_hypo', 'Hipotermijos prevencija', 'hypo']];
  const ROWS = [['fl', 'Skysčiai', 2, 'iv'], ['bl', 'Kraujo produktai', 2, 'blood'], ['an', 'Analgetikai', 3, 'an'], ['ab', 'Antibiotikai', 2, 'ab'], ['ot', 'Kiti vaistai (pvz. TXA)', 2, '']];
  const has = (R, k, t) => (R.tx[k] || 0) > (t || 0.012);
  function buildForm() {
    const F = S.form || { id: '', sex: '', t0: '', mech: [], mechTxt: '', allerg: '', evac: '', tq: {}, marks: [], vit: [], tb: {}, eye: '', rows: [], notes: '' };
    const R = S.res.f;
    if (R && !F._f) {
      F._f = 1;
      if (R.cb.sex_m.on && !R.cb.sex_f.on) F.sex = 'V'; else if (R.cb.sex_f.on && !R.cb.sex_m.on) F.sex = 'M';
      const mt = [];
      Object.keys(MECH_MAP).forEach(k => { if (R.cb['m_' + k] && R.cb['m_' + k].on) { const m = MECH_MAP[k]; if (F.mech.indexOf(m[0]) < 0) F.mech.push(m[0]); if (m[1]) mt.push(m[1]); } });
      if (mt.length) F.mechTxt = mt.join(', ');
      EVAC.forEach(([k]) => { if (R.cb['ev_' + k] && R.cb['ev_' + k].on) F.evac = k; });
      TQL.forEach(([k]) => { F.tq[k] = { on: has(R, 'tq_' + k + '_time') || has(R, 'tq_' + k + '_type'), tm: '' }; });
      F.marks = R.marks.map(m => Object.assign({ on: true, t: 'Z' }, m, markPos(m)));
      for (let c = 0; c < 4; c++) if (['ts', 'hr', 'bp', 'rr', 'spo2', 'av', 'pain'].some(k => has(R, 'v' + c + '_' + k, 0.015))) F.vit.push({ c, ts: '', hr: '', bp: '', rr: '', spo2: '', av: '', pain: '' });
    }
    const B = S.res.b;
    if (B && !F._b) {
      F._b = 1;
      TXB.forEach(([k]) => { F.tb[k] = !!(B.cb[k] && B.cb[k].on); });
      F.eye = (B.cb.o_eye_r.on ? 'D' : '') + (B.cb.o_eye_l.on ? 'K' : '');
      ROWS.forEach(([p, , n, t]) => { for (let i = 0; i < n; i++) if (has(B, p + i, 0.01)) F.rows.push({ k: p + i, g: p, t, name: '', dose: '', route: '', time: '' }); });
      if (B.cb.ev_u.on) F.evac = F.evac || 'u'; else if (B.cb.ev_p.on) F.evac = F.evac || 'p'; else if (B.cb.ev_r.on) F.evac = F.evac || 'r';
    }
    S.form = F;
  }
  // ── MIST kortelė iš formos ──
  function toCard() {
    const F = S.form, mk = [], tx = [], note = [], extra = [];
    TXB.forEach(([k, , t, x]) => { if (!F.tb[k]) return; if (t && tx.indexOf(t) < 0) tx.push(t); if (x) extra.push(x + (k === 'o_eye' && F.eye ? ' ' + F.eye.split('').join(', ') : '')); });
    let tqT = '';
    TQL.forEach(([k, , p]) => { const q = F.tq[k]; if (!q || !q.on) return; mk.push({ t: 'T', s: 'f', x: p[0], y: p[1], tm: q.tm || '' }); if (tx.indexOf('tq') < 0) tx.push('tq'); if (q.tm && (!tqT || q.tm < tqT)) tqT = q.tm; });
    const used = {};
    F.marks.forEach(m => { if (!m.on) return; const key = m.s + m.x + ',' + m.y, o = (used[key] = (used[key] || 0) + 1) - 1; mk.push({ t: m.t || 'Z', s: m.s, x: m.x + o * 4, y: m.y + o * 3, tm: '' }); });
    const vit = F.vit.filter(v => ['ts', 'hr', 'bp', 'rr', 'spo2', 'av', 'pain'].some(k => String(v[k]).trim())).map(v => ({ ts: v.ts || '', av: v.av || '', hr: v.hr, rr: v.rr, bp: v.bp, spo2: v.spo2, gcs: '', pain: v.pain }));
    let txaT = '';
    F.rows.forEach(r => { const t = [r.name, r.dose, r.route, r.time].map(x => String(x || '').trim()).filter(Boolean).join(' '); if (!t) return; note.push(t); if (r.t && tx.indexOf(r.t) < 0) tx.push(r.t); if (/txa|tranek/i.test(r.name) && tx.indexOf('txa') < 0) { tx.push('txa'); txaT = String(r.time || '').trim(); } });
    if (extra.length) note.unshift(extra.join(', '));
    if (F.allerg.trim()) note.push('Alergijos: ' + F.allerg.trim());
    if (F.evac) note.push('Evakuacija: ' + (EVAC.find(e => e[0] === F.evac) || ['', ''])[1]);
    if (F.notes.trim()) note.push(F.notes.trim());
    note.push('(perkelta iš popierinės kortelės – patikrinta ' + nowHM() + ')');
    return { id: F.id.trim(), sex: F.sex, t0: F.t0, mech: F.mech.slice(), mechTxt: F.mechTxt.trim(), mk, injTxt: '', vit, tx, tqT, txaT: HM_RE.test(txaT) ? txaT : '', txTxt: note.join('; ') };
  }
  // ── vaizdas ──
  const SIDES = [['f', 'Priekis'], ['b', 'Galas']];
  const img = (u, cls) => u ? `<div class="skcw"><img class="${cls || 'skc'}" alt="" src="${u}"></div>` : '';
  const inp = (k, v, ph, extra) => `<input class="inp" data-sk="${k}" value="${esc(v)}" placeholder="${esc(ph)}" autocomplete="off"${extra || ''}>`;
  const tin = (k, v) => `<input type="time" class="inp" data-sk="${k}" value="${esc(v)}">`;
  function stage() {
    return `<div class="skst" id="skst"><canvas id="skcv"></canvas>${[0, 1, 2, 3].map(i => `<div class="skh" data-i="${i}" aria-label="Kampas ${i + 1}"></div>`).join('')}</div>` +
      '<p class="muted">Patraukite 4 taškus ant storo kortelės rėmelio kampų (viršus kairėje → pagal laikrodžio rodyklę).</p>' +
      '<div class="acts"><button class="btn pri" data-act="sk-run">Ištiesinti ir nuskaityti</button></div><div class="acts"><button class="btn" data-act="sk-rot">Pasukti 90°</button><button class="btn" data-act="sk-auto">Rasti kampus iš naujo</button><button class="btn dng" data-act="sk-cancel">Atšaukti</button></div>';
  }
  function review() {
    const F = S.form, R = S.res.f, B = S.res.b, t = T();
    let h = '<h2>Peržiūra ir taisymas</h2><p class="muted">Pažymėta automatiškai – patikrinkite. Ranka rašytą tekstą suveskite žiūrėdami į iškarpą. Raudonas rėmelis – neaiškus langelis.</p>';
    const chip2 = (act, k, on, lb, unsure) => `<button class="${on ? 'on' : ''}${unsure ? ' sku' : ''}" data-act="${act}" data-k="${esc(k)}" aria-pressed="${!!on}">${lb}</button>`;
    if (R) {
      const s = t.sides.f.tx;
      h += '<section class="card skr"><b>Sužeistasis</b>' + img(crop(uni(s.roster, s.name), 'f')) + inp('id', F.id, 'ID / šaukinys (ne vardas)') +
        '<div class="lbl">Lytis</div><div class="chips">' + chip2('sk-sex', 'V', F.sex === 'V', 'Vyras', R.cb.sex_m.unsure) + chip2('sk-sex', 'M', F.sex === 'M', 'Moteris', R.cb.sex_f.unsure) + '</div>' +
        '<div class="lbl">Sužeidimo laikas</div>' + img(crop(uni(s.date, s.time), 'f')) + tin('t0', F.t0) +
        (has(R, 'allerg') ? '<div class="lbl">Alergijos</div>' + img(crop(s.allerg, 'f')) + inp('allerg', F.allerg, 'Alergijos') : '') + '</section>';
      h += '<section class="card skr"><b>Mechanizmas</b><div class="opts">' + ['Šautinė žaizda', 'Sprogimas', 'Bukas sužalojimas', 'Nudegimas', 'Kritimas', 'Eismo įvykis', 'Kita'].map(m => chip2('sk-mech', m, F.mech.indexOf(m) >= 0, esc(m))).join('') + '</div>' +
        (has(R, 'm_other') ? img(crop(s.m_other, 'f')) : '') + inp('mechTxt', F.mechTxt, 'Patikslinimas (pvz. mina, RPG)') + '</section>';
      h += '<section class="card skr"><b>Turniketai</b>' + TQL.map(([k, lb]) => { const q = F.tq[k] || {}; return `<div class="skrow">${chip2('sk-tq', k, q.on, esc(lb))}${q.on || has(R, 'tq_' + k + '_time') ? img(crop(uni(s['tq_' + k + '_type'], s['tq_' + k + '_time']), 'f', 0.1)) + tin('tq.' + k, q.tm) : ''}</div>`; }).join('') + '</section>';
      h += '<section class="card skr"><b>Žymės ant kūno schemos</b>' + (F.marks.length ? '<p class="muted mt0">Rastos X žymės – priskirtos artimiausiai kūno sričiai. Nepažymėkite klaidingų.</p>' + F.marks.map((m, i) => `<div class="skrow">${chip2('sk-mk', String(i), m.on, esc(MC.region(m.s, m.x, m.y).t))}<select class="inp sksel" data-sk="mk.${i}">${[['Z', 'Žaizda'], ['K', 'Kraujavimas'], ['L', 'Lūžis'], ['N', 'Nudegimas'], ['A', 'Amputacija']].map(([v, l]) => `<option value="${v}"${m.t === v ? ' selected' : ''}>${l}</option>`).join('')}</select></div>`).join('') : '<p class="muted mt0">Žymių nerasta. Jei kortelėje jų yra – sužymėkite MIST kortelėje rankiniu būdu.</p>') +
        img(crop(t.body.Ant.map((v, i) => i === 2 ? t.body.Post[2] : v), 'f', 0), 'skc skbody') + '</section>';
      h += '<section class="card skr"><b>Požymiai</b>' + (F.vit.length ? F.vit.map((v, i) => { const c = v.c; return `<div class="skv">${img(crop(uni(s['v' + c + '_ts'], s['v' + c + '_pain']), 'f', 0.05), 'skc skcol')}<div class="skvg">` +
        [['ts', 'Laikas', 'time'], ['hr', 'Pulsas'], ['bp', 'AKS'], ['rr', 'KD'], ['spo2', 'SpO₂'], ['pain', 'Skausmas']].map(([k, lb, ty]) => `<label>${lb}${ty === 'time' ? tin('v.' + i + '.ts', v.ts) : inp('v.' + i + '.' + k, v[k], '', k === 'bp' ? '' : ' inputmode="numeric"')}</label>`).join('') +
        `<label>AVPU<select class="inp sksel" data-sk="v.${i}.av"><option value="">–</option>${['A', 'V', 'P', 'U'].map(a => `<option${v.av === a ? ' selected' : ''}>${a}</option>`).join('')}</select></label></div></div>`; }).join('') : '<p class="muted mt0">Įrašų lentelėje nerasta.</p>') + '</section>';
    }
    if (B) {
      const s = t.sides.b.tx;
      h += '<section class="card skr"><b>Teikta pagalba</b><div class="opts">' + TXB.map(([k, lb]) => chip2('sk-tb', k, F.tb[k], esc(lb), B.cb[k] && B.cb[k].unsure)).join('') + '</div>' +
        (F.tb.o_eye ? '<div class="lbl">Akies skydelis</div><div class="chips">' + chip2('sk-eye', 'D', F.eye.indexOf('D') >= 0, 'Dešinė') + chip2('sk-eye', 'K', F.eye.indexOf('K') >= 0, 'Kairė') + '</div>' : '') +
        ['t_tq', 't_dr', 't_a', 't_b'].filter(k => has(B, k)).map(k => img(crop(s[k], 'b'))).join('') + '</section>';
      h += '<section class="card skr"><b>Skysčiai, kraujas, vaistai</b>' + (F.rows.length ? F.rows.map((r, i) => `<div class="skv"><small class="muted">${esc((ROWS.find(x => x[0] === r.g) || ['', ''])[1])}</small>${img(crop(s[r.k], 'b', 0.1))}<div class="skvg">` +
        [['name', 'Pavadinimas'], ['dose', 'Dozė / kiekis'], ['route', 'Būdas'], ['time', 'Laikas']].map(([k, lb]) => `<label>${lb}${inp('r.' + i + '.' + k, r[k], '')}</label>`).join('') + '</div></div>').join('') : '<p class="muted mt0">Įrašų nerasta.</p>') + '</section>';
      if (has(B, 'notes', 0.004)) h += '<section class="card skr"><b>Pastabos</b>' + img(crop(s.notes, 'b', 0)) + `<textarea class="inp" data-sk="notes" rows="3">${esc(F.notes)}</textarea></section>`;
    }
    h += '<section class="card skr"><b>Evakuacija</b><div class="chips">' + EVAC.map(([k, lb]) => chip2('sk-ev', k, F.evac === k, esc(lb.split(' ')[0]))).join('') + '</div></section>';
    h += '<button class="btn pri" data-act="sk-save">Įrašyti kaip naują sužeistąjį (MIST)</button><p class="muted">Po įrašymo atsidarys MIST kortelė – dar kartą patikrinkite ir papildykite.</p>';
    return h;
  }
  function view() {
    const t = T();
    let h = '<h1>Nuskaityti popierinę kortelę</h1>';
    if (mode === 'learn' || !S.res.f && !S.res.b) h += '<p class="muted">Nufotografuokite užpildytą kortelę iš viršaus, gerai apšviestą, kad matytųsi visas rėmelis. Programėlė ištiesins vaizdą, nuskaitys pažymėtus langelius ir X žymes ant kūno schemos, o ranka rašytus laukus parodys iškarpomis – juos suvesite patys. Veikia be interneto; nuotrauka nesaugoma.</p>';
    h += `<div class="seg2" role="group" aria-label="Kortelė"><button class="on" aria-pressed="true">${esc(t.name)}</button></div>`;
    if (S.src && !S.busy) return h + `<h2>${esc((SIDES.find(x => x[0] === S.side) || ['', ''])[1])}</h2>` + stage();
    if (S.busy) return h + '<p class="muted">Apdorojama…</p>';
    h += '<div class="sksides">' + SIDES.map(([k, lb]) => `<div class="card"><b>${lb}</b>${S.res[k] ? '<span class="tag grn">nuskaityta</span>' + img(S.res[k].url, 'skthumb') : '<p class="muted mt0">dar nenuskaityta</p>'}` +
      `<label class="btn" data-sk-side="${k}">📷 Fotografuoti<input type="file" accept="image/*" capture="environment" data-skf="${k}" hidden></label><label class="btn">Iš galerijos<input type="file" accept="image/*" data-skf="${k}" hidden></label></div>`).join('') + '</div>';
    if (S.err) h += '<div class="warn">' + esc(S.err) + '</div>';
    if (S.res.f || S.res.b) h += review() + '<div class="acts"><button class="btn dng" data-act="sk-reset">Pradėti iš naujo</button></div>';
    return h;
  }
  // ── kampų redagavimas ──
  let disp = 1;
  function drawStage() {
    const cv = document.getElementById('skcv'), st = document.getElementById('skst'); if (!cv || !st || !S.src) return;
    const w = st.clientWidth || 340; disp = w / S.src.width;
    cv.width = Math.round(S.src.width * disp); cv.height = Math.round(S.src.height * disp);
    const c = cv.getContext('2d'); c.drawImage(S.src, 0, 0, cv.width, cv.height);
    c.strokeStyle = '#18C964'; c.lineWidth = 2.5; c.beginPath(); S.q.forEach((p, i) => { const x = p[0] * disp, y = p[1] * disp; if (i) c.lineTo(x, y); else c.moveTo(x, y); }); c.closePath(); c.stroke();
    st.querySelectorAll('.skh').forEach(hd => { const p = S.q[+hd.dataset.i]; hd.style.left = p[0] * disp + 'px'; hd.style.top = p[1] * disp + 'px'; });
  }
  function after(page) {
    if (page !== 'skenuoti') return;
    app.querySelectorAll('input[data-skf]').forEach(f => f.addEventListener('change', () => { if (f.files && f.files[0]) pick(f.dataset.skf, f.files[0]); }));
    const st = document.getElementById('skst'); if (!st) return;
    drawStage();
    let drag = -1;
    st.addEventListener('pointerdown', e => { const hd = e.target.closest('.skh'); if (!hd) return; drag = +hd.dataset.i; hd.setPointerCapture(e.pointerId); e.preventDefault(); });
    st.addEventListener('pointermove', e => { if (drag < 0) return; const r = st.getBoundingClientRect(); S.q[drag] = [Math.max(0, Math.min(S.src.width, (e.clientX - r.left) / disp)), Math.max(0, Math.min(S.src.height, (e.clientY - r.top) / disp))]; drawStage(); });
    const up = () => { drag = -1; }; st.addEventListener('pointerup', up); st.addEventListener('pointercancel', up);
  }
  async function pick(side, file) {
    S.err = ''; S.side = side;
    let url = '';
    try { url = URL.createObjectURL(file); const im = await loadImg(url); S.src = toCanvas(im, 1800); S.q = autoCorners(S.src, T().anchor); }
    catch (e) { S.src = null; S.err = 'Nepavyko atidaryti nuotraukos.'; }
    finally { if (url) URL.revokeObjectURL(url); }
    render(); scrollTo(0, 0);
  }
  async function run() {
    S.busy = true; render();
    await new Promise(r => setTimeout(r, 30));
    try { S.res[S.side] = await analyse(S.side); S.src = null; buildForm(); }
    catch (e) { console.error(e); S.err = 'Nepavyko apdoroti nuotraukos. Bandykite dar kartą (geresnė šviesa, visas rėmelis kadre).'; }
    S.busy = false; render(); scrollTo(0, 0);
  }
  function set(path, val) {
    const F = S.form; if (!F) return; const p = path.split('.');
    if (p[0] === 'tq') { F.tq[p[1]] = F.tq[p[1]] || { on: true, tm: '' }; F.tq[p[1]].tm = val; if (val) F.tq[p[1]].on = true; }
    else if (p[0] === 'mk') { const m = F.marks[+p[1]]; if (m) m.t = val; }
    else if (p[0] === 'v') { const v = F.vit[+p[1]]; if (v) v[p[2]] = val; }
    else if (p[0] === 'r') { const r = F.rows[+p[1]]; if (r) r[p[2]] = val; }
    else F[p[0]] = val;
  }
  function onInput(t) { set(t.dataset.sk, t.value); }
  function act(el) {
    const d = el.dataset, k = d.k, F = S.form, keep = () => { const y = scrollY; render(); scrollTo(0, y); };
    switch (d.act) {
      case 'sk-run': return run();
      case 'sk-cancel': S.src = null; render(); return;
      case 'sk-auto': S.q = autoCorners(S.src, T().anchor); drawStage(); return;
      case 'sk-rot': { const c = document.createElement('canvas'); c.width = S.src.height; c.height = S.src.width; const x = c.getContext('2d'); x.translate(c.width, 0); x.rotate(Math.PI / 2); x.drawImage(S.src, 0, 0); S.src = c; S.q = autoCorners(c, T().anchor); render(); return; }
      case 'sk-reset': if (!confirm('Pradėti iš naujo? Nuskaityti duomenys bus išmesti.')) return; S.res = {}; S.form = null; S.src = null; S.err = ''; render(); return;
      case 'sk-sex': F.sex = F.sex === k ? '' : k; return keep();
      case 'sk-mech': { const i = F.mech.indexOf(k); if (i >= 0) F.mech.splice(i, 1); else F.mech.push(k); return keep(); }
      case 'sk-tq': F.tq[k] = F.tq[k] || { on: false, tm: '' }; F.tq[k].on = !F.tq[k].on; return keep();
      case 'sk-mk': { const m = F.marks[+k]; if (m) m.on = !m.on; return keep(); }
      case 'sk-tb': F.tb[k] = !F.tb[k]; return keep();
      case 'sk-eye': F.eye = F.eye.indexOf(k) >= 0 ? F.eye.replace(k, '') : (F.eye + k).split('').sort().join(''); return keep();
      case 'sk-ev': F.evac = F.evac === k ? '' : k; return keep();
      case 'sk-save': {
        if (!F) return;
        const card = toCard();
        if (card.t0 && !HM_RE.test(card.t0)) { toast('Sužeidimo laikas: pvz. 14:05'); return; }
        PT.add(card); S.res = {}; S.form = null; S.src = null;
        toast('Įrašyta kaip naujas sužeistasis – patikrinkite MIST kortelę');
        location.hash = '#/mist'; return;
      }
    }
  }
  return { view, act, after, onInput, debug: () => S, analyse, autoCorners, markPos };
})();
