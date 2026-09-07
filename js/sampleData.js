/**
 * sampleData.js
 * Pre-loaded college courses parsed directly from real university portal schedule HTML:
 * 1. Applied Programming - ECE2102
 * 2. Electrical Circuits I - EEE2304
 * 3. Introduction to Communication Systems - EEC2220
 * 4. Differential Equations - EBA2201
 * 5. Digital Logic Design - ECE2201
 * 6. Engineering Economy - UNR2303
 * 7. Numerical Methods - ECE2402
 */

const SampleScheduleData = (() => {
  const DEFAULT_COURSE_SET = [
    {
        "id":  "ECE2102",
        "name":  "Applied Programming - ECE2102",
        "code":  "ECE2102",
        "instructors":  [
                            "مجد نبيل نصرى نعمه",
                            "احمد زكريا نور محمد طلحه",
                            "د. هشام صلاح الدين محمد رشاد",
                            "د. دينا محمد علي ابو الدهب",
                            "د. يارا اشرف كامل محمد",
                            "محمد حسام محمد علي"
                        ],
        "groups":  [
                       {
                           "group":  "E",
                           "sessions":  [
                                            {
                                                "id":  "ECE2102_E_Lab._Saturday_1",
                                                "courseName":  "Applied Programming - ECE2102",
                                                "courseCode":  "ECE2102",
                                                "group":  "E",
                                                "type":  "Lab.",
                                                "day":  "Saturday",
                                                "startSlot":  1,
                                                "endSlot":  2,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#3B82F6"
                                            },
                                            {
                                                "id":  "ECE2102_E_Lect._Wednesday_3",
                                                "courseName":  "Applied Programming - ECE2102",
                                                "courseCode":  "ECE2102",
                                                "group":  "E",
                                                "type":  "Lect.",
                                                "day":  "Wednesday",
                                                "startSlot":  3,
                                                "endSlot":  4,
                                                "duration":  2,
                                                "instructor":  "د. هشام صلاح الدين محمد رشاد",
                                                "color":  "#3B82F6"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "د. هشام صلاح الدين محمد رشاد"
                                           ]
                       },
                       {
                           "group":  "B",
                           "sessions":  [
                                            {
                                                "id":  "ECE2102_B_Lab._Sunday_7",
                                                "courseName":  "Applied Programming - ECE2102",
                                                "courseCode":  "ECE2102",
                                                "group":  "B",
                                                "type":  "Lab.",
                                                "day":  "Sunday",
                                                "startSlot":  7,
                                                "endSlot":  8,
                                                "duration":  2,
                                                "instructor":  "مجد نبيل نصرى نعمه",
                                                "color":  "#3B82F6"
                                            },
                                            {
                                                "id":  "ECE2102_B_Lect._Tuesday_3",
                                                "courseName":  "Applied Programming - ECE2102",
                                                "courseCode":  "ECE2102",
                                                "group":  "B",
                                                "type":  "Lect.",
                                                "day":  "Tuesday",
                                                "startSlot":  3,
                                                "endSlot":  4,
                                                "duration":  2,
                                                "instructor":  "د. هشام صلاح الدين محمد رشاد",
                                                "color":  "#3B82F6"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "مجد نبيل نصرى نعمه",
                                               "د. هشام صلاح الدين محمد رشاد"
                                           ]
                       },
                       {
                           "group":  "L",
                           "sessions":  [
                                            {
                                                "id":  "ECE2102_L_Lab._Sunday_11",
                                                "courseName":  "Applied Programming - ECE2102",
                                                "courseCode":  "ECE2102",
                                                "group":  "L",
                                                "type":  "Lab.",
                                                "day":  "Sunday",
                                                "startSlot":  11,
                                                "endSlot":  12,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#3B82F6"
                                            },
                                            {
                                                "id":  "ECE2102_L_Lect._Thursday_7",
                                                "courseName":  "Applied Programming - ECE2102",
                                                "courseCode":  "ECE2102",
                                                "group":  "L",
                                                "type":  "Lect.",
                                                "day":  "Thursday",
                                                "startSlot":  7,
                                                "endSlot":  8,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#3B82F6"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [

                                           ]
                       },
                       {
                           "group":  "I",
                           "sessions":  [
                                            {
                                                "id":  "ECE2102_I_Lab._Monday_5",
                                                "courseName":  "Applied Programming - ECE2102",
                                                "courseCode":  "ECE2102",
                                                "group":  "I",
                                                "type":  "Lab.",
                                                "day":  "Monday",
                                                "startSlot":  5,
                                                "endSlot":  6,
                                                "duration":  2,
                                                "instructor":  "احمد زكريا نور محمد طلحه",
                                                "color":  "#3B82F6"
                                            },
                                            {
                                                "id":  "ECE2102_I_Lect._Tuesday_5",
                                                "courseName":  "Applied Programming - ECE2102",
                                                "courseCode":  "ECE2102",
                                                "group":  "I",
                                                "type":  "Lect.",
                                                "day":  "Tuesday",
                                                "startSlot":  5,
                                                "endSlot":  6,
                                                "duration":  2,
                                                "instructor":  "د. دينا محمد علي ابو الدهب",
                                                "color":  "#3B82F6"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "احمد زكريا نور محمد طلحه",
                                               "د. دينا محمد علي ابو الدهب"
                                           ]
                       },
                       {
                           "group":  "F",
                           "sessions":  [
                                            {
                                                "id":  "ECE2102_F_Lect._Tuesday_1",
                                                "courseName":  "Applied Programming - ECE2102",
                                                "courseCode":  "ECE2102",
                                                "group":  "F",
                                                "type":  "Lect.",
                                                "day":  "Tuesday",
                                                "startSlot":  1,
                                                "endSlot":  2,
                                                "duration":  2,
                                                "instructor":  "د. هشام صلاح الدين محمد رشاد",
                                                "color":  "#3B82F6"
                                            },
                                            {
                                                "id":  "ECE2102_F_Lab._Thursday_3",
                                                "courseName":  "Applied Programming - ECE2102",
                                                "courseCode":  "ECE2102",
                                                "group":  "F",
                                                "type":  "Lab.",
                                                "day":  "Thursday",
                                                "startSlot":  3,
                                                "endSlot":  4,
                                                "duration":  2,
                                                "instructor":  "محمد حسام محمد علي",
                                                "color":  "#3B82F6"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "د. هشام صلاح الدين محمد رشاد",
                                               "محمد حسام محمد علي"
                                           ]
                       },
                       {
                           "group":  "H",
                           "sessions":  [
                                            {
                                                "id":  "ECE2102_H_Lect._Tuesday_5",
                                                "courseName":  "Applied Programming - ECE2102",
                                                "courseCode":  "ECE2102",
                                                "group":  "H",
                                                "type":  "Lect.",
                                                "day":  "Tuesday",
                                                "startSlot":  5,
                                                "endSlot":  6,
                                                "duration":  2,
                                                "instructor":  "د. دينا محمد علي ابو الدهب",
                                                "color":  "#3B82F6"
                                            },
                                            {
                                                "id":  "ECE2102_H_Lab._Wednesday_1",
                                                "courseName":  "Applied Programming - ECE2102",
                                                "courseCode":  "ECE2102",
                                                "group":  "H",
                                                "type":  "Lab.",
                                                "day":  "Wednesday",
                                                "startSlot":  1,
                                                "endSlot":  2,
                                                "duration":  2,
                                                "instructor":  "احمد زكريا نور محمد طلحه",
                                                "color":  "#3B82F6"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "د. دينا محمد علي ابو الدهب",
                                               "احمد زكريا نور محمد طلحه"
                                           ]
                       },
                       {
                           "group":  "G",
                           "sessions":  [
                                            {
                                                "id":  "ECE2102_G_Lect._Tuesday_1",
                                                "courseName":  "Applied Programming - ECE2102",
                                                "courseCode":  "ECE2102",
                                                "group":  "G",
                                                "type":  "Lect.",
                                                "day":  "Tuesday",
                                                "startSlot":  1,
                                                "endSlot":  2,
                                                "duration":  2,
                                                "instructor":  "د. هشام صلاح الدين محمد رشاد",
                                                "color":  "#3B82F6"
                                            },
                                            {
                                                "id":  "ECE2102_G_Lab._Thursday_1",
                                                "courseName":  "Applied Programming - ECE2102",
                                                "courseCode":  "ECE2102",
                                                "group":  "G",
                                                "type":  "Lab.",
                                                "day":  "Thursday",
                                                "startSlot":  1,
                                                "endSlot":  2,
                                                "duration":  2,
                                                "instructor":  "محمد حسام محمد علي",
                                                "color":  "#3B82F6"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "د. هشام صلاح الدين محمد رشاد",
                                               "محمد حسام محمد علي"
                                           ]
                       },
                       {
                           "group":  "C",
                           "sessions":  [
                                            {
                                                "id":  "ECE2102_C_Lect._Tuesday_3",
                                                "courseName":  "Applied Programming - ECE2102",
                                                "courseCode":  "ECE2102",
                                                "group":  "C",
                                                "type":  "Lect.",
                                                "day":  "Tuesday",
                                                "startSlot":  3,
                                                "endSlot":  4,
                                                "duration":  2,
                                                "instructor":  "د. هشام صلاح الدين محمد رشاد",
                                                "color":  "#3B82F6"
                                            },
                                            {
                                                "id":  "ECE2102_C_Lab._Thursday_5",
                                                "courseName":  "Applied Programming - ECE2102",
                                                "courseCode":  "ECE2102",
                                                "group":  "C",
                                                "type":  "Lab.",
                                                "day":  "Thursday",
                                                "startSlot":  5,
                                                "endSlot":  6,
                                                "duration":  2,
                                                "instructor":  "مجد نبيل نصرى نعمه",
                                                "color":  "#3B82F6"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "د. هشام صلاح الدين محمد رشاد",
                                               "مجد نبيل نصرى نعمه"
                                           ]
                       },
                       {
                           "group":  "D",
                           "sessions":  [
                                            {
                                                "id":  "ECE2102_D_Lect._Wednesday_3",
                                                "courseName":  "Applied Programming - ECE2102",
                                                "courseCode":  "ECE2102",
                                                "group":  "D",
                                                "type":  "Lect.",
                                                "day":  "Wednesday",
                                                "startSlot":  3,
                                                "endSlot":  4,
                                                "duration":  2,
                                                "instructor":  "د. هشام صلاح الدين محمد رشاد",
                                                "color":  "#3B82F6"
                                            },
                                            {
                                                "id":  "ECE2102_D_Lab._Wednesday_5",
                                                "courseName":  "Applied Programming - ECE2102",
                                                "courseCode":  "ECE2102",
                                                "group":  "D",
                                                "type":  "Lab.",
                                                "day":  "Wednesday",
                                                "startSlot":  5,
                                                "endSlot":  6,
                                                "duration":  2,
                                                "instructor":  "مجد نبيل نصرى نعمه",
                                                "color":  "#3B82F6"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "د. هشام صلاح الدين محمد رشاد",
                                               "مجد نبيل نصرى نعمه"
                                           ]
                       },
                       {
                           "group":  "J",
                           "sessions":  [
                                            {
                                                "id":  "ECE2102_J_Lect._Wednesday_7",
                                                "courseName":  "Applied Programming - ECE2102",
                                                "courseCode":  "ECE2102",
                                                "group":  "J",
                                                "type":  "Lect.",
                                                "day":  "Wednesday",
                                                "startSlot":  7,
                                                "endSlot":  8,
                                                "duration":  2,
                                                "instructor":  "د. يارا اشرف كامل محمد",
                                                "color":  "#3B82F6"
                                            },
                                            {
                                                "id":  "ECE2102_J_Lab._Thursday_7",
                                                "courseName":  "Applied Programming - ECE2102",
                                                "courseCode":  "ECE2102",
                                                "group":  "J",
                                                "type":  "Lab.",
                                                "day":  "Thursday",
                                                "startSlot":  7,
                                                "endSlot":  8,
                                                "duration":  2,
                                                "instructor":  "محمد حسام محمد علي",
                                                "color":  "#3B82F6"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "د. يارا اشرف كامل محمد",
                                               "محمد حسام محمد علي"
                                           ]
                       },
                       {
                           "group":  "K",
                           "sessions":  [
                                            {
                                                "id":  "ECE2102_K_Lab._Wednesday_11",
                                                "courseName":  "Applied Programming - ECE2102",
                                                "courseCode":  "ECE2102",
                                                "group":  "K",
                                                "type":  "Lab.",
                                                "day":  "Wednesday",
                                                "startSlot":  11,
                                                "endSlot":  12,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#3B82F6"
                                            },
                                            {
                                                "id":  "ECE2102_K_Lect._Wednesday_7",
                                                "courseName":  "Applied Programming - ECE2102",
                                                "courseCode":  "ECE2102",
                                                "group":  "K",
                                                "type":  "Lect.",
                                                "day":  "Wednesday",
                                                "startSlot":  7,
                                                "endSlot":  8,
                                                "duration":  2,
                                                "instructor":  "د. يارا اشرف كامل محمد",
                                                "color":  "#3B82F6"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "د. يارا اشرف كامل محمد"
                                           ]
                       }
                   ],
        "slots":  [
                      {
                          "id":  "ECE2102_E_Lab._Saturday_1",
                          "courseName":  "Applied Programming - ECE2102",
                          "courseCode":  "ECE2102",
                          "group":  "E",
                          "type":  "Lab.",
                          "day":  "Saturday",
                          "startSlot":  1,
                          "endSlot":  2,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#3B82F6"
                      },
                      {
                          "id":  "ECE2102_B_Lab._Sunday_7",
                          "courseName":  "Applied Programming - ECE2102",
                          "courseCode":  "ECE2102",
                          "group":  "B",
                          "type":  "Lab.",
                          "day":  "Sunday",
                          "startSlot":  7,
                          "endSlot":  8,
                          "duration":  2,
                          "instructor":  "مجد نبيل نصرى نعمه",
                          "color":  "#3B82F6"
                      },
                      {
                          "id":  "ECE2102_L_Lab._Sunday_11",
                          "courseName":  "Applied Programming - ECE2102",
                          "courseCode":  "ECE2102",
                          "group":  "L",
                          "type":  "Lab.",
                          "day":  "Sunday",
                          "startSlot":  11,
                          "endSlot":  12,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#3B82F6"
                      },
                      {
                          "id":  "ECE2102_I_Lab._Monday_5",
                          "courseName":  "Applied Programming - ECE2102",
                          "courseCode":  "ECE2102",
                          "group":  "I",
                          "type":  "Lab.",
                          "day":  "Monday",
                          "startSlot":  5,
                          "endSlot":  6,
                          "duration":  2,
                          "instructor":  "احمد زكريا نور محمد طلحه",
                          "color":  "#3B82F6"
                      },
                      {
                          "id":  "ECE2102_F_Lect._Tuesday_1",
                          "courseName":  "Applied Programming - ECE2102",
                          "courseCode":  "ECE2102",
                          "group":  "F",
                          "type":  "Lect.",
                          "day":  "Tuesday",
                          "startSlot":  1,
                          "endSlot":  2,
                          "duration":  2,
                          "instructor":  "د. هشام صلاح الدين محمد رشاد",
                          "color":  "#3B82F6"
                      },
                      {
                          "id":  "ECE2102_B_Lect._Tuesday_3",
                          "courseName":  "Applied Programming - ECE2102",
                          "courseCode":  "ECE2102",
                          "group":  "B",
                          "type":  "Lect.",
                          "day":  "Tuesday",
                          "startSlot":  3,
                          "endSlot":  4,
                          "duration":  2,
                          "instructor":  "د. هشام صلاح الدين محمد رشاد",
                          "color":  "#3B82F6"
                      },
                      {
                          "id":  "ECE2102_H_Lect._Tuesday_5",
                          "courseName":  "Applied Programming - ECE2102",
                          "courseCode":  "ECE2102",
                          "group":  "H",
                          "type":  "Lect.",
                          "day":  "Tuesday",
                          "startSlot":  5,
                          "endSlot":  6,
                          "duration":  2,
                          "instructor":  "د. دينا محمد علي ابو الدهب",
                          "color":  "#3B82F6"
                      },
                      {
                          "id":  "ECE2102_G_Lect._Tuesday_1",
                          "courseName":  "Applied Programming - ECE2102",
                          "courseCode":  "ECE2102",
                          "group":  "G",
                          "type":  "Lect.",
                          "day":  "Tuesday",
                          "startSlot":  1,
                          "endSlot":  2,
                          "duration":  2,
                          "instructor":  "د. هشام صلاح الدين محمد رشاد",
                          "color":  "#3B82F6"
                      },
                      {
                          "id":  "ECE2102_C_Lect._Tuesday_3",
                          "courseName":  "Applied Programming - ECE2102",
                          "courseCode":  "ECE2102",
                          "group":  "C",
                          "type":  "Lect.",
                          "day":  "Tuesday",
                          "startSlot":  3,
                          "endSlot":  4,
                          "duration":  2,
                          "instructor":  "د. هشام صلاح الدين محمد رشاد",
                          "color":  "#3B82F6"
                      },
                      {
                          "id":  "ECE2102_I_Lect._Tuesday_5",
                          "courseName":  "Applied Programming - ECE2102",
                          "courseCode":  "ECE2102",
                          "group":  "I",
                          "type":  "Lect.",
                          "day":  "Tuesday",
                          "startSlot":  5,
                          "endSlot":  6,
                          "duration":  2,
                          "instructor":  "د. دينا محمد علي ابو الدهب",
                          "color":  "#3B82F6"
                      },
                      {
                          "id":  "ECE2102_H_Lab._Wednesday_1",
                          "courseName":  "Applied Programming - ECE2102",
                          "courseCode":  "ECE2102",
                          "group":  "H",
                          "type":  "Lab.",
                          "day":  "Wednesday",
                          "startSlot":  1,
                          "endSlot":  2,
                          "duration":  2,
                          "instructor":  "احمد زكريا نور محمد طلحه",
                          "color":  "#3B82F6"
                      },
                      {
                          "id":  "ECE2102_D_Lect._Wednesday_3",
                          "courseName":  "Applied Programming - ECE2102",
                          "courseCode":  "ECE2102",
                          "group":  "D",
                          "type":  "Lect.",
                          "day":  "Wednesday",
                          "startSlot":  3,
                          "endSlot":  4,
                          "duration":  2,
                          "instructor":  "د. هشام صلاح الدين محمد رشاد",
                          "color":  "#3B82F6"
                      },
                      {
                          "id":  "ECE2102_D_Lab._Wednesday_5",
                          "courseName":  "Applied Programming - ECE2102",
                          "courseCode":  "ECE2102",
                          "group":  "D",
                          "type":  "Lab.",
                          "day":  "Wednesday",
                          "startSlot":  5,
                          "endSlot":  6,
                          "duration":  2,
                          "instructor":  "مجد نبيل نصرى نعمه",
                          "color":  "#3B82F6"
                      },
                      {
                          "id":  "ECE2102_J_Lect._Wednesday_7",
                          "courseName":  "Applied Programming - ECE2102",
                          "courseCode":  "ECE2102",
                          "group":  "J",
                          "type":  "Lect.",
                          "day":  "Wednesday",
                          "startSlot":  7,
                          "endSlot":  8,
                          "duration":  2,
                          "instructor":  "د. يارا اشرف كامل محمد",
                          "color":  "#3B82F6"
                      },
                      {
                          "id":  "ECE2102_K_Lab._Wednesday_11",
                          "courseName":  "Applied Programming - ECE2102",
                          "courseCode":  "ECE2102",
                          "group":  "K",
                          "type":  "Lab.",
                          "day":  "Wednesday",
                          "startSlot":  11,
                          "endSlot":  12,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#3B82F6"
                      },
                      {
                          "id":  "ECE2102_E_Lect._Wednesday_3",
                          "courseName":  "Applied Programming - ECE2102",
                          "courseCode":  "ECE2102",
                          "group":  "E",
                          "type":  "Lect.",
                          "day":  "Wednesday",
                          "startSlot":  3,
                          "endSlot":  4,
                          "duration":  2,
                          "instructor":  "د. هشام صلاح الدين محمد رشاد",
                          "color":  "#3B82F6"
                      },
                      {
                          "id":  "ECE2102_K_Lect._Wednesday_7",
                          "courseName":  "Applied Programming - ECE2102",
                          "courseCode":  "ECE2102",
                          "group":  "K",
                          "type":  "Lect.",
                          "day":  "Wednesday",
                          "startSlot":  7,
                          "endSlot":  8,
                          "duration":  2,
                          "instructor":  "د. يارا اشرف كامل محمد",
                          "color":  "#3B82F6"
                      },
                      {
                          "id":  "ECE2102_G_Lab._Thursday_1",
                          "courseName":  "Applied Programming - ECE2102",
                          "courseCode":  "ECE2102",
                          "group":  "G",
                          "type":  "Lab.",
                          "day":  "Thursday",
                          "startSlot":  1,
                          "endSlot":  2,
                          "duration":  2,
                          "instructor":  "محمد حسام محمد علي",
                          "color":  "#3B82F6"
                      },
                      {
                          "id":  "ECE2102_F_Lab._Thursday_3",
                          "courseName":  "Applied Programming - ECE2102",
                          "courseCode":  "ECE2102",
                          "group":  "F",
                          "type":  "Lab.",
                          "day":  "Thursday",
                          "startSlot":  3,
                          "endSlot":  4,
                          "duration":  2,
                          "instructor":  "محمد حسام محمد علي",
                          "color":  "#3B82F6"
                      },
                      {
                          "id":  "ECE2102_C_Lab._Thursday_5",
                          "courseName":  "Applied Programming - ECE2102",
                          "courseCode":  "ECE2102",
                          "group":  "C",
                          "type":  "Lab.",
                          "day":  "Thursday",
                          "startSlot":  5,
                          "endSlot":  6,
                          "duration":  2,
                          "instructor":  "مجد نبيل نصرى نعمه",
                          "color":  "#3B82F6"
                      },
                      {
                          "id":  "ECE2102_J_Lab._Thursday_7",
                          "courseName":  "Applied Programming - ECE2102",
                          "courseCode":  "ECE2102",
                          "group":  "J",
                          "type":  "Lab.",
                          "day":  "Thursday",
                          "startSlot":  7,
                          "endSlot":  8,
                          "duration":  2,
                          "instructor":  "محمد حسام محمد علي",
                          "color":  "#3B82F6"
                      },
                      {
                          "id":  "ECE2102_L_Lect._Thursday_7",
                          "courseName":  "Applied Programming - ECE2102",
                          "courseCode":  "ECE2102",
                          "group":  "L",
                          "type":  "Lect.",
                          "day":  "Thursday",
                          "startSlot":  7,
                          "endSlot":  8,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#3B82F6"
                      }
                  ],
        "color":  "#3B82F6"
    },
    {
        "id":  "EEE2304",
        "name":  "Electrical Circuits I - EEE2304",
        "code":  "EEE2304",
        "instructors":  [
                            "حازم مجدي احمد محمد",
                            "د. هادى ماجد راغب الحلو",
                            "د. ميرنا فؤاد عبدالسلام عبدالمعطى على",
                            "د. بسنت احمد السيد خليل"
                        ],
        "groups":  [
                       {
                           "group":  "A",
                           "sessions":  [
                                            {
                                                "id":  "EEE2304_A_Sec._Saturday_1",
                                                "courseName":  "Electrical Circuits I - EEE2304",
                                                "courseCode":  "EEE2304",
                                                "group":  "A",
                                                "type":  "Sec.",
                                                "day":  "Saturday",
                                                "startSlot":  1,
                                                "endSlot":  2,
                                                "duration":  2,
                                                "instructor":  "حازم مجدي احمد محمد",
                                                "color":  "#8B5CF6"
                                            },
                                            {
                                                "id":  "EEE2304_A_Lect._Sunday_3",
                                                "courseName":  "Electrical Circuits I - EEE2304",
                                                "courseCode":  "EEE2304",
                                                "group":  "A",
                                                "type":  "Lect.",
                                                "day":  "Sunday",
                                                "startSlot":  3,
                                                "endSlot":  4,
                                                "duration":  2,
                                                "instructor":  "د. هادى ماجد راغب الحلو",
                                                "color":  "#8B5CF6"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "حازم مجدي احمد محمد",
                                               "د. هادى ماجد راغب الحلو"
                                           ]
                       },
                       {
                           "group":  "B",
                           "sessions":  [
                                            {
                                                "id":  "EEE2304_B_Sec._Saturday_3",
                                                "courseName":  "Electrical Circuits I - EEE2304",
                                                "courseCode":  "EEE2304",
                                                "group":  "B",
                                                "type":  "Sec.",
                                                "day":  "Saturday",
                                                "startSlot":  3,
                                                "endSlot":  4,
                                                "duration":  2,
                                                "instructor":  "حازم مجدي احمد محمد",
                                                "color":  "#8B5CF6"
                                            },
                                            {
                                                "id":  "EEE2304_B_Lect._Sunday_3",
                                                "courseName":  "Electrical Circuits I - EEE2304",
                                                "courseCode":  "EEE2304",
                                                "group":  "B",
                                                "type":  "Lect.",
                                                "day":  "Sunday",
                                                "startSlot":  3,
                                                "endSlot":  4,
                                                "duration":  2,
                                                "instructor":  "د. هادى ماجد راغب الحلو",
                                                "color":  "#8B5CF6"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "حازم مجدي احمد محمد",
                                               "د. هادى ماجد راغب الحلو"
                                           ]
                       },
                       {
                           "group":  "C",
                           "sessions":  [
                                            {
                                                "id":  "EEE2304_C_Lect._Sunday_5",
                                                "courseName":  "Electrical Circuits I - EEE2304",
                                                "courseCode":  "EEE2304",
                                                "group":  "C",
                                                "type":  "Lect.",
                                                "day":  "Sunday",
                                                "startSlot":  5,
                                                "endSlot":  6,
                                                "duration":  2,
                                                "instructor":  "د. هادى ماجد راغب الحلو",
                                                "color":  "#8B5CF6"
                                            },
                                            {
                                                "id":  "EEE2304_C_Sec._Thursday_3",
                                                "courseName":  "Electrical Circuits I - EEE2304",
                                                "courseCode":  "EEE2304",
                                                "group":  "C",
                                                "type":  "Sec.",
                                                "day":  "Thursday",
                                                "startSlot":  3,
                                                "endSlot":  4,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#8B5CF6"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "د. هادى ماجد راغب الحلو"
                                           ]
                       },
                       {
                           "group":  "F",
                           "sessions":  [
                                            {
                                                "id":  "EEE2304_F_Sec._Sunday_7",
                                                "courseName":  "Electrical Circuits I - EEE2304",
                                                "courseCode":  "EEE2304",
                                                "group":  "F",
                                                "type":  "Sec.",
                                                "day":  "Sunday",
                                                "startSlot":  7,
                                                "endSlot":  8,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#8B5CF6"
                                            },
                                            {
                                                "id":  "EEE2304_F_Lect._Wednesday_1",
                                                "courseName":  "Electrical Circuits I - EEE2304",
                                                "courseCode":  "EEE2304",
                                                "group":  "F",
                                                "type":  "Lect.",
                                                "day":  "Wednesday",
                                                "startSlot":  1,
                                                "endSlot":  2,
                                                "duration":  2,
                                                "instructor":  "د. ميرنا فؤاد عبدالسلام عبدالمعطى على",
                                                "color":  "#8B5CF6"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "د. ميرنا فؤاد عبدالسلام عبدالمعطى على"
                                           ]
                       },
                       {
                           "group":  "D",
                           "sessions":  [
                                            {
                                                "id":  "EEE2304_D_Lect._Sunday_5",
                                                "courseName":  "Electrical Circuits I - EEE2304",
                                                "courseCode":  "EEE2304",
                                                "group":  "D",
                                                "type":  "Lect.",
                                                "day":  "Sunday",
                                                "startSlot":  5,
                                                "endSlot":  6,
                                                "duration":  2,
                                                "instructor":  "د. هادى ماجد راغب الحلو",
                                                "color":  "#8B5CF6"
                                            },
                                            {
                                                "id":  "EEE2304_D_Sec._Wednesday_5",
                                                "courseName":  "Electrical Circuits I - EEE2304",
                                                "courseCode":  "EEE2304",
                                                "group":  "D",
                                                "type":  "Sec.",
                                                "day":  "Wednesday",
                                                "startSlot":  5,
                                                "endSlot":  6,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#8B5CF6"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "د. هادى ماجد راغب الحلو"
                                           ]
                       },
                       {
                           "group":  "K",
                           "sessions":  [
                                            {
                                                "id":  "EEE2304_K_Sec._Sunday_5",
                                                "courseName":  "Electrical Circuits I - EEE2304",
                                                "courseCode":  "EEE2304",
                                                "group":  "K",
                                                "type":  "Sec.",
                                                "day":  "Sunday",
                                                "startSlot":  5,
                                                "endSlot":  6,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#8B5CF6"
                                            },
                                            {
                                                "id":  "EEE2304_K_Lect._Wednesday_7",
                                                "courseName":  "Electrical Circuits I - EEE2304",
                                                "courseCode":  "EEE2304",
                                                "group":  "K",
                                                "type":  "Lect.",
                                                "day":  "Wednesday",
                                                "startSlot":  7,
                                                "endSlot":  8,
                                                "duration":  2,
                                                "instructor":  "د. بسنت احمد السيد خليل",
                                                "color":  "#8B5CF6"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "د. بسنت احمد السيد خليل"
                                           ]
                       },
                       {
                           "group":  "J",
                           "sessions":  [
                                            {
                                                "id":  "EEE2304_J_Sec._Monday_5",
                                                "courseName":  "Electrical Circuits I - EEE2304",
                                                "courseCode":  "EEE2304",
                                                "group":  "J",
                                                "type":  "Sec.",
                                                "day":  "Monday",
                                                "startSlot":  5,
                                                "endSlot":  6,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#8B5CF6"
                                            },
                                            {
                                                "id":  "EEE2304_J_Lect._Wednesday_5",
                                                "courseName":  "Electrical Circuits I - EEE2304",
                                                "courseCode":  "EEE2304",
                                                "group":  "J",
                                                "type":  "Lect.",
                                                "day":  "Wednesday",
                                                "startSlot":  5,
                                                "endSlot":  6,
                                                "duration":  2,
                                                "instructor":  "د. بسنت احمد السيد خليل",
                                                "color":  "#8B5CF6"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "د. بسنت احمد السيد خليل"
                                           ]
                       },
                       {
                           "group":  "E",
                           "sessions":  [
                                            {
                                                "id":  "EEE2304_E_Sec._Monday_7",
                                                "courseName":  "Electrical Circuits I - EEE2304",
                                                "courseCode":  "EEE2304",
                                                "group":  "E",
                                                "type":  "Sec.",
                                                "day":  "Monday",
                                                "startSlot":  7,
                                                "endSlot":  8,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#8B5CF6"
                                            },
                                            {
                                                "id":  "EEE2304_E_Lect._Wednesday_1",
                                                "courseName":  "Electrical Circuits I - EEE2304",
                                                "courseCode":  "EEE2304",
                                                "group":  "E",
                                                "type":  "Lect.",
                                                "day":  "Wednesday",
                                                "startSlot":  1,
                                                "endSlot":  2,
                                                "duration":  2,
                                                "instructor":  "د. ميرنا فؤاد عبدالسلام عبدالمعطى على",
                                                "color":  "#8B5CF6"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "د. ميرنا فؤاد عبدالسلام عبدالمعطى على"
                                           ]
                       },
                       {
                           "group":  "G",
                           "sessions":  [
                                            {
                                                "id":  "EEE2304_G_Sec._Monday_9",
                                                "courseName":  "Electrical Circuits I - EEE2304",
                                                "courseCode":  "EEE2304",
                                                "group":  "G",
                                                "type":  "Sec.",
                                                "day":  "Monday",
                                                "startSlot":  9,
                                                "endSlot":  10,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#8B5CF6"
                                            },
                                            {
                                                "id":  "EEE2304_G_Lect._Wednesday_3",
                                                "courseName":  "Electrical Circuits I - EEE2304",
                                                "courseCode":  "EEE2304",
                                                "group":  "G",
                                                "type":  "Lect.",
                                                "day":  "Wednesday",
                                                "startSlot":  3,
                                                "endSlot":  4,
                                                "duration":  2,
                                                "instructor":  "د. ميرنا فؤاد عبدالسلام عبدالمعطى على",
                                                "color":  "#8B5CF6"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "د. ميرنا فؤاد عبدالسلام عبدالمعطى على"
                                           ]
                       },
                       {
                           "group":  "H",
                           "sessions":  [
                                            {
                                                "id":  "EEE2304_H_Sec._Wednesday_7",
                                                "courseName":  "Electrical Circuits I - EEE2304",
                                                "courseCode":  "EEE2304",
                                                "group":  "H",
                                                "type":  "Sec.",
                                                "day":  "Wednesday",
                                                "startSlot":  7,
                                                "endSlot":  8,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#8B5CF6"
                                            },
                                            {
                                                "id":  "EEE2304_H_Lect._Wednesday_3",
                                                "courseName":  "Electrical Circuits I - EEE2304",
                                                "courseCode":  "EEE2304",
                                                "group":  "H",
                                                "type":  "Lect.",
                                                "day":  "Wednesday",
                                                "startSlot":  3,
                                                "endSlot":  4,
                                                "duration":  2,
                                                "instructor":  "د. ميرنا فؤاد عبدالسلام عبدالمعطى على",
                                                "color":  "#8B5CF6"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "د. ميرنا فؤاد عبدالسلام عبدالمعطى على"
                                           ]
                       },
                       {
                           "group":  "I",
                           "sessions":  [
                                            {
                                                "id":  "EEE2304_I_Sec._Wednesday_9",
                                                "courseName":  "Electrical Circuits I - EEE2304",
                                                "courseCode":  "EEE2304",
                                                "group":  "I",
                                                "type":  "Sec.",
                                                "day":  "Wednesday",
                                                "startSlot":  9,
                                                "endSlot":  10,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#8B5CF6"
                                            },
                                            {
                                                "id":  "EEE2304_I_Lect._Wednesday_5",
                                                "courseName":  "Electrical Circuits I - EEE2304",
                                                "courseCode":  "EEE2304",
                                                "group":  "I",
                                                "type":  "Lect.",
                                                "day":  "Wednesday",
                                                "startSlot":  5,
                                                "endSlot":  6,
                                                "duration":  2,
                                                "instructor":  "د. بسنت احمد السيد خليل",
                                                "color":  "#8B5CF6"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "د. بسنت احمد السيد خليل"
                                           ]
                       }
                   ],
        "slots":  [
                      {
                          "id":  "EEE2304_A_Sec._Saturday_1",
                          "courseName":  "Electrical Circuits I - EEE2304",
                          "courseCode":  "EEE2304",
                          "group":  "A",
                          "type":  "Sec.",
                          "day":  "Saturday",
                          "startSlot":  1,
                          "endSlot":  2,
                          "duration":  2,
                          "instructor":  "حازم مجدي احمد محمد",
                          "color":  "#8B5CF6"
                      },
                      {
                          "id":  "EEE2304_B_Sec._Saturday_3",
                          "courseName":  "Electrical Circuits I - EEE2304",
                          "courseCode":  "EEE2304",
                          "group":  "B",
                          "type":  "Sec.",
                          "day":  "Saturday",
                          "startSlot":  3,
                          "endSlot":  4,
                          "duration":  2,
                          "instructor":  "حازم مجدي احمد محمد",
                          "color":  "#8B5CF6"
                      },
                      {
                          "id":  "EEE2304_A_Lect._Sunday_3",
                          "courseName":  "Electrical Circuits I - EEE2304",
                          "courseCode":  "EEE2304",
                          "group":  "A",
                          "type":  "Lect.",
                          "day":  "Sunday",
                          "startSlot":  3,
                          "endSlot":  4,
                          "duration":  2,
                          "instructor":  "د. هادى ماجد راغب الحلو",
                          "color":  "#8B5CF6"
                      },
                      {
                          "id":  "EEE2304_C_Lect._Sunday_5",
                          "courseName":  "Electrical Circuits I - EEE2304",
                          "courseCode":  "EEE2304",
                          "group":  "C",
                          "type":  "Lect.",
                          "day":  "Sunday",
                          "startSlot":  5,
                          "endSlot":  6,
                          "duration":  2,
                          "instructor":  "د. هادى ماجد راغب الحلو",
                          "color":  "#8B5CF6"
                      },
                      {
                          "id":  "EEE2304_F_Sec._Sunday_7",
                          "courseName":  "Electrical Circuits I - EEE2304",
                          "courseCode":  "EEE2304",
                          "group":  "F",
                          "type":  "Sec.",
                          "day":  "Sunday",
                          "startSlot":  7,
                          "endSlot":  8,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#8B5CF6"
                      },
                      {
                          "id":  "EEE2304_B_Lect._Sunday_3",
                          "courseName":  "Electrical Circuits I - EEE2304",
                          "courseCode":  "EEE2304",
                          "group":  "B",
                          "type":  "Lect.",
                          "day":  "Sunday",
                          "startSlot":  3,
                          "endSlot":  4,
                          "duration":  2,
                          "instructor":  "د. هادى ماجد راغب الحلو",
                          "color":  "#8B5CF6"
                      },
                      {
                          "id":  "EEE2304_D_Lect._Sunday_5",
                          "courseName":  "Electrical Circuits I - EEE2304",
                          "courseCode":  "EEE2304",
                          "group":  "D",
                          "type":  "Lect.",
                          "day":  "Sunday",
                          "startSlot":  5,
                          "endSlot":  6,
                          "duration":  2,
                          "instructor":  "د. هادى ماجد راغب الحلو",
                          "color":  "#8B5CF6"
                      },
                      {
                          "id":  "EEE2304_K_Sec._Sunday_5",
                          "courseName":  "Electrical Circuits I - EEE2304",
                          "courseCode":  "EEE2304",
                          "group":  "K",
                          "type":  "Sec.",
                          "day":  "Sunday",
                          "startSlot":  5,
                          "endSlot":  6,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#8B5CF6"
                      },
                      {
                          "id":  "EEE2304_J_Sec._Monday_5",
                          "courseName":  "Electrical Circuits I - EEE2304",
                          "courseCode":  "EEE2304",
                          "group":  "J",
                          "type":  "Sec.",
                          "day":  "Monday",
                          "startSlot":  5,
                          "endSlot":  6,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#8B5CF6"
                      },
                      {
                          "id":  "EEE2304_E_Sec._Monday_7",
                          "courseName":  "Electrical Circuits I - EEE2304",
                          "courseCode":  "EEE2304",
                          "group":  "E",
                          "type":  "Sec.",
                          "day":  "Monday",
                          "startSlot":  7,
                          "endSlot":  8,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#8B5CF6"
                      },
                      {
                          "id":  "EEE2304_G_Sec._Monday_9",
                          "courseName":  "Electrical Circuits I - EEE2304",
                          "courseCode":  "EEE2304",
                          "group":  "G",
                          "type":  "Sec.",
                          "day":  "Monday",
                          "startSlot":  9,
                          "endSlot":  10,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#8B5CF6"
                      },
                      {
                          "id":  "EEE2304_E_Lect._Wednesday_1",
                          "courseName":  "Electrical Circuits I - EEE2304",
                          "courseCode":  "EEE2304",
                          "group":  "E",
                          "type":  "Lect.",
                          "day":  "Wednesday",
                          "startSlot":  1,
                          "endSlot":  2,
                          "duration":  2,
                          "instructor":  "د. ميرنا فؤاد عبدالسلام عبدالمعطى على",
                          "color":  "#8B5CF6"
                      },
                      {
                          "id":  "EEE2304_G_Lect._Wednesday_3",
                          "courseName":  "Electrical Circuits I - EEE2304",
                          "courseCode":  "EEE2304",
                          "group":  "G",
                          "type":  "Lect.",
                          "day":  "Wednesday",
                          "startSlot":  3,
                          "endSlot":  4,
                          "duration":  2,
                          "instructor":  "د. ميرنا فؤاد عبدالسلام عبدالمعطى على",
                          "color":  "#8B5CF6"
                      },
                      {
                          "id":  "EEE2304_D_Sec._Wednesday_5",
                          "courseName":  "Electrical Circuits I - EEE2304",
                          "courseCode":  "EEE2304",
                          "group":  "D",
                          "type":  "Sec.",
                          "day":  "Wednesday",
                          "startSlot":  5,
                          "endSlot":  6,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#8B5CF6"
                      },
                      {
                          "id":  "EEE2304_H_Sec._Wednesday_7",
                          "courseName":  "Electrical Circuits I - EEE2304",
                          "courseCode":  "EEE2304",
                          "group":  "H",
                          "type":  "Sec.",
                          "day":  "Wednesday",
                          "startSlot":  7,
                          "endSlot":  8,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#8B5CF6"
                      },
                      {
                          "id":  "EEE2304_I_Sec._Wednesday_9",
                          "courseName":  "Electrical Circuits I - EEE2304",
                          "courseCode":  "EEE2304",
                          "group":  "I",
                          "type":  "Sec.",
                          "day":  "Wednesday",
                          "startSlot":  9,
                          "endSlot":  10,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#8B5CF6"
                      },
                      {
                          "id":  "EEE2304_F_Lect._Wednesday_1",
                          "courseName":  "Electrical Circuits I - EEE2304",
                          "courseCode":  "EEE2304",
                          "group":  "F",
                          "type":  "Lect.",
                          "day":  "Wednesday",
                          "startSlot":  1,
                          "endSlot":  2,
                          "duration":  2,
                          "instructor":  "د. ميرنا فؤاد عبدالسلام عبدالمعطى على",
                          "color":  "#8B5CF6"
                      },
                      {
                          "id":  "EEE2304_H_Lect._Wednesday_3",
                          "courseName":  "Electrical Circuits I - EEE2304",
                          "courseCode":  "EEE2304",
                          "group":  "H",
                          "type":  "Lect.",
                          "day":  "Wednesday",
                          "startSlot":  3,
                          "endSlot":  4,
                          "duration":  2,
                          "instructor":  "د. ميرنا فؤاد عبدالسلام عبدالمعطى على",
                          "color":  "#8B5CF6"
                      },
                      {
                          "id":  "EEE2304_I_Lect._Wednesday_5",
                          "courseName":  "Electrical Circuits I - EEE2304",
                          "courseCode":  "EEE2304",
                          "group":  "I",
                          "type":  "Lect.",
                          "day":  "Wednesday",
                          "startSlot":  5,
                          "endSlot":  6,
                          "duration":  2,
                          "instructor":  "د. بسنت احمد السيد خليل",
                          "color":  "#8B5CF6"
                      },
                      {
                          "id":  "EEE2304_J_Lect._Wednesday_5",
                          "courseName":  "Electrical Circuits I - EEE2304",
                          "courseCode":  "EEE2304",
                          "group":  "J",
                          "type":  "Lect.",
                          "day":  "Wednesday",
                          "startSlot":  5,
                          "endSlot":  6,
                          "duration":  2,
                          "instructor":  "د. بسنت احمد السيد خليل",
                          "color":  "#8B5CF6"
                      },
                      {
                          "id":  "EEE2304_K_Lect._Wednesday_7",
                          "courseName":  "Electrical Circuits I - EEE2304",
                          "courseCode":  "EEE2304",
                          "group":  "K",
                          "type":  "Lect.",
                          "day":  "Wednesday",
                          "startSlot":  7,
                          "endSlot":  8,
                          "duration":  2,
                          "instructor":  "د. بسنت احمد السيد خليل",
                          "color":  "#8B5CF6"
                      },
                      {
                          "id":  "EEE2304_C_Sec._Thursday_3",
                          "courseName":  "Electrical Circuits I - EEE2304",
                          "courseCode":  "EEE2304",
                          "group":  "C",
                          "type":  "Sec.",
                          "day":  "Thursday",
                          "startSlot":  3,
                          "endSlot":  4,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#8B5CF6"
                      }
                  ],
        "color":  "#8B5CF6"
    },
    {
        "id":  "EEC2220",
        "name":  "Introduction to Communication Systems - EEC2220",
        "code":  "EEC2220",
        "instructors":  [
                            "احمد محمد عبدالوهاب دعبس",
                            "ساندرين خالد محمود محمد حسن",
                            "د. البشير عادل يوسف محمد يوسف",
                            "د. حسين مصطفى صبحى العطار",
                            "مصطفى محمد السيد جودة",
                            "د. كريم احمد عبد الرحمن حموده حماد"
                        ],
        "groups":  [
                       {
                           "group":  "D",
                           "sessions":  [
                                            {
                                                "id":  "EEC2220_D_Lab._Saturday_5",
                                                "courseName":  "Introduction to Communication Systems - EEC2220",
                                                "courseCode":  "EEC2220",
                                                "group":  "D",
                                                "type":  "Lab.",
                                                "day":  "Saturday",
                                                "startSlot":  5,
                                                "endSlot":  6,
                                                "duration":  2,
                                                "instructor":  "احمد محمد عبدالوهاب دعبس",
                                                "color":  "#10B981"
                                            },
                                            {
                                                "id":  "EEC2220_D_Lect._Sunday_7",
                                                "courseName":  "Introduction to Communication Systems - EEC2220",
                                                "courseCode":  "EEC2220",
                                                "group":  "D",
                                                "type":  "Lect.",
                                                "day":  "Sunday",
                                                "startSlot":  7,
                                                "endSlot":  8,
                                                "duration":  2,
                                                "instructor":  "د. البشير عادل يوسف محمد يوسف",
                                                "color":  "#10B981"
                                            },
                                            {
                                                "id":  "EEC2220_D_Sec._Tuesday_1",
                                                "courseName":  "Introduction to Communication Systems - EEC2220",
                                                "courseCode":  "EEC2220",
                                                "group":  "D",
                                                "type":  "Sec.",
                                                "day":  "Tuesday",
                                                "startSlot":  1,
                                                "endSlot":  2,
                                                "duration":  2,
                                                "instructor":  "مصطفى محمد السيد جودة",
                                                "color":  "#10B981"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "احمد محمد عبدالوهاب دعبس",
                                               "د. البشير عادل يوسف محمد يوسف",
                                               "مصطفى محمد السيد جودة"
                                           ]
                       },
                       {
                           "group":  "I",
                           "sessions":  [
                                            {
                                                "id":  "EEC2220_I_Sec._Saturday_7",
                                                "courseName":  "Introduction to Communication Systems - EEC2220",
                                                "courseCode":  "EEC2220",
                                                "group":  "I",
                                                "type":  "Sec.",
                                                "day":  "Saturday",
                                                "startSlot":  7,
                                                "endSlot":  8,
                                                "duration":  2,
                                                "instructor":  "ساندرين خالد محمود محمد حسن",
                                                "color":  "#10B981"
                                            },
                                            {
                                                "id":  "EEC2220_I_Lab._Saturday_9",
                                                "courseName":  "Introduction to Communication Systems - EEC2220",
                                                "courseCode":  "EEC2220",
                                                "group":  "I",
                                                "type":  "Lab.",
                                                "day":  "Saturday",
                                                "startSlot":  9,
                                                "endSlot":  10,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#10B981"
                                            },
                                            {
                                                "id":  "EEC2220_I_Lect._Wednesday_3",
                                                "courseName":  "Introduction to Communication Systems - EEC2220",
                                                "courseCode":  "EEC2220",
                                                "group":  "I",
                                                "type":  "Lect.",
                                                "day":  "Wednesday",
                                                "startSlot":  3,
                                                "endSlot":  4,
                                                "duration":  2,
                                                "instructor":  "د. حسين مصطفى صبحى العطار",
                                                "color":  "#10B981"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "ساندرين خالد محمود محمد حسن",
                                               "د. حسين مصطفى صبحى العطار"
                                           ]
                       },
                       {
                           "group":  "K",
                           "sessions":  [
                                            {
                                                "id":  "EEC2220_K_Lab._Saturday_11",
                                                "courseName":  "Introduction to Communication Systems - EEC2220",
                                                "courseCode":  "EEC2220",
                                                "group":  "K",
                                                "type":  "Lab.",
                                                "day":  "Saturday",
                                                "startSlot":  11,
                                                "endSlot":  12,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#10B981"
                                            },
                                            {
                                                "id":  "EEC2220_K_Sec._Saturday_9",
                                                "courseName":  "Introduction to Communication Systems - EEC2220",
                                                "courseCode":  "EEC2220",
                                                "group":  "K",
                                                "type":  "Sec.",
                                                "day":  "Saturday",
                                                "startSlot":  9,
                                                "endSlot":  10,
                                                "duration":  2,
                                                "instructor":  "ساندرين خالد محمود محمد حسن",
                                                "color":  "#10B981"
                                            },
                                            {
                                                "id":  "EEC2220_K_Lect._Tuesday_7",
                                                "courseName":  "Introduction to Communication Systems - EEC2220",
                                                "courseCode":  "EEC2220",
                                                "group":  "K",
                                                "type":  "Lect.",
                                                "day":  "Tuesday",
                                                "startSlot":  7,
                                                "endSlot":  8,
                                                "duration":  2,
                                                "instructor":  "د. حسين مصطفى صبحى العطار",
                                                "color":  "#10B981"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "ساندرين خالد محمود محمد حسن",
                                               "د. حسين مصطفى صبحى العطار"
                                           ]
                       },
                       {
                           "group":  "G",
                           "sessions":  [
                                            {
                                                "id":  "EEC2220_G_Lab._Saturday_5",
                                                "courseName":  "Introduction to Communication Systems - EEC2220",
                                                "courseCode":  "EEC2220",
                                                "group":  "G",
                                                "type":  "Lab.",
                                                "day":  "Saturday",
                                                "startSlot":  5,
                                                "endSlot":  6,
                                                "duration":  2,
                                                "instructor":  "ساندرين خالد محمود محمد حسن",
                                                "color":  "#10B981"
                                            },
                                            {
                                                "id":  "EEC2220_G_Lect._Sunday_7",
                                                "courseName":  "Introduction to Communication Systems - EEC2220",
                                                "courseCode":  "EEC2220",
                                                "group":  "G",
                                                "type":  "Lect.",
                                                "day":  "Sunday",
                                                "startSlot":  7,
                                                "endSlot":  8,
                                                "duration":  2,
                                                "instructor":  "د. حسين مصطفى صبحى العطار",
                                                "color":  "#10B981"
                                            },
                                            {
                                                "id":  "EEC2220_G_Sec._Wednesday_7",
                                                "courseName":  "Introduction to Communication Systems - EEC2220",
                                                "courseCode":  "EEC2220",
                                                "group":  "G",
                                                "type":  "Sec.",
                                                "day":  "Wednesday",
                                                "startSlot":  7,
                                                "endSlot":  8,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#10B981"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "ساندرين خالد محمود محمد حسن",
                                               "د. حسين مصطفى صبحى العطار"
                                           ]
                       },
                       {
                           "group":  "J",
                           "sessions":  [
                                            {
                                                "id":  "EEC2220_J_Lab._Saturday_7",
                                                "courseName":  "Introduction to Communication Systems - EEC2220",
                                                "courseCode":  "EEC2220",
                                                "group":  "J",
                                                "type":  "Lab.",
                                                "day":  "Saturday",
                                                "startSlot":  7,
                                                "endSlot":  8,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#10B981"
                                            },
                                            {
                                                "id":  "EEC2220_J_Sec._Monday_9",
                                                "courseName":  "Introduction to Communication Systems - EEC2220",
                                                "courseCode":  "EEC2220",
                                                "group":  "J",
                                                "type":  "Sec.",
                                                "day":  "Monday",
                                                "startSlot":  9,
                                                "endSlot":  10,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#10B981"
                                            },
                                            {
                                                "id":  "EEC2220_J_Lect._Wednesday_3",
                                                "courseName":  "Introduction to Communication Systems - EEC2220",
                                                "courseCode":  "EEC2220",
                                                "group":  "J",
                                                "type":  "Lect.",
                                                "day":  "Wednesday",
                                                "startSlot":  3,
                                                "endSlot":  4,
                                                "duration":  2,
                                                "instructor":  "د. حسين مصطفى صبحى العطار",
                                                "color":  "#10B981"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "د. حسين مصطفى صبحى العطار"
                                           ]
                       },
                       {
                           "group":  "C",
                           "sessions":  [
                                            {
                                                "id":  "EEC2220_C_Lab._Sunday_3",
                                                "courseName":  "Introduction to Communication Systems - EEC2220",
                                                "courseCode":  "EEC2220",
                                                "group":  "C",
                                                "type":  "Lab.",
                                                "day":  "Sunday",
                                                "startSlot":  3,
                                                "endSlot":  4,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#10B981"
                                            },
                                            {
                                                "id":  "EEC2220_C_Lect._Sunday_7",
                                                "courseName":  "Introduction to Communication Systems - EEC2220",
                                                "courseCode":  "EEC2220",
                                                "group":  "C",
                                                "type":  "Lect.",
                                                "day":  "Sunday",
                                                "startSlot":  7,
                                                "endSlot":  8,
                                                "duration":  2,
                                                "instructor":  "د. البشير عادل يوسف محمد يوسف",
                                                "color":  "#10B981"
                                            },
                                            {
                                                "id":  "EEC2220_C_Sec._Tuesday_3",
                                                "courseName":  "Introduction to Communication Systems - EEC2220",
                                                "courseCode":  "EEC2220",
                                                "group":  "C",
                                                "type":  "Sec.",
                                                "day":  "Tuesday",
                                                "startSlot":  3,
                                                "endSlot":  4,
                                                "duration":  2,
                                                "instructor":  "مصطفى محمد السيد جودة",
                                                "color":  "#10B981"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "د. البشير عادل يوسف محمد يوسف",
                                               "مصطفى محمد السيد جودة"
                                           ]
                       },
                       {
                           "group":  "B",
                           "sessions":  [
                                            {
                                                "id":  "EEC2220_B_Lab._Sunday_5",
                                                "courseName":  "Introduction to Communication Systems - EEC2220",
                                                "courseCode":  "EEC2220",
                                                "group":  "B",
                                                "type":  "Lab.",
                                                "day":  "Sunday",
                                                "startSlot":  5,
                                                "endSlot":  6,
                                                "duration":  2,
                                                "instructor":  "ساندرين خالد محمود محمد حسن",
                                                "color":  "#10B981"
                                            },
                                            {
                                                "id":  "EEC2220_B_Sec._Monday_1",
                                                "courseName":  "Introduction to Communication Systems - EEC2220",
                                                "courseCode":  "EEC2220",
                                                "group":  "B",
                                                "type":  "Sec.",
                                                "day":  "Monday",
                                                "startSlot":  1,
                                                "endSlot":  2,
                                                "duration":  2,
                                                "instructor":  "مصطفى محمد السيد جودة",
                                                "color":  "#10B981"
                                            },
                                            {
                                                "id":  "EEC2220_B_Lect._Thursday_7",
                                                "courseName":  "Introduction to Communication Systems - EEC2220",
                                                "courseCode":  "EEC2220",
                                                "group":  "B",
                                                "type":  "Lect.",
                                                "day":  "Thursday",
                                                "startSlot":  7,
                                                "endSlot":  8,
                                                "duration":  2,
                                                "instructor":  "د. البشير عادل يوسف محمد يوسف",
                                                "color":  "#10B981"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "ساندرين خالد محمود محمد حسن",
                                               "مصطفى محمد السيد جودة",
                                               "د. البشير عادل يوسف محمد يوسف"
                                           ]
                       },
                       {
                           "group":  "E",
                           "sessions":  [
                                            {
                                                "id":  "EEC2220_E_Lab._Sunday_9",
                                                "courseName":  "Introduction to Communication Systems - EEC2220",
                                                "courseCode":  "EEC2220",
                                                "group":  "E",
                                                "type":  "Lab.",
                                                "day":  "Sunday",
                                                "startSlot":  9,
                                                "endSlot":  10,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#10B981"
                                            },
                                            {
                                                "id":  "EEC2220_E_Lect._Monday_3",
                                                "courseName":  "Introduction to Communication Systems - EEC2220",
                                                "courseCode":  "EEC2220",
                                                "group":  "E",
                                                "type":  "Lect.",
                                                "day":  "Monday",
                                                "startSlot":  3,
                                                "endSlot":  4,
                                                "duration":  2,
                                                "instructor":  "د. كريم احمد عبد الرحمن حموده حماد",
                                                "color":  "#10B981"
                                            },
                                            {
                                                "id":  "EEC2220_E_Sec._Thursday_1",
                                                "courseName":  "Introduction to Communication Systems - EEC2220",
                                                "courseCode":  "EEC2220",
                                                "group":  "E",
                                                "type":  "Sec.",
                                                "day":  "Thursday",
                                                "startSlot":  1,
                                                "endSlot":  2,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#10B981"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "د. كريم احمد عبد الرحمن حموده حماد"
                                           ]
                       },
                       {
                           "group":  "H",
                           "sessions":  [
                                            {
                                                "id":  "EEC2220_H_Lect._Sunday_7",
                                                "courseName":  "Introduction to Communication Systems - EEC2220",
                                                "courseCode":  "EEC2220",
                                                "group":  "H",
                                                "type":  "Lect.",
                                                "day":  "Sunday",
                                                "startSlot":  7,
                                                "endSlot":  8,
                                                "duration":  2,
                                                "instructor":  "د. حسين مصطفى صبحى العطار",
                                                "color":  "#10B981"
                                            },
                                            {
                                                "id":  "EEC2220_H_Lab._Monday_11",
                                                "courseName":  "Introduction to Communication Systems - EEC2220",
                                                "courseCode":  "EEC2220",
                                                "group":  "H",
                                                "type":  "Lab.",
                                                "day":  "Monday",
                                                "startSlot":  11,
                                                "endSlot":  12,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#10B981"
                                            },
                                            {
                                                "id":  "EEC2220_H_Sec._Wednesday_11",
                                                "courseName":  "Introduction to Communication Systems - EEC2220",
                                                "courseCode":  "EEC2220",
                                                "group":  "H",
                                                "type":  "Sec.",
                                                "day":  "Wednesday",
                                                "startSlot":  11,
                                                "endSlot":  12,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#10B981"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "د. حسين مصطفى صبحى العطار"
                                           ]
                       },
                       {
                           "group":  "L",
                           "sessions":  [
                                            {
                                                "id":  "EEC2220_L_Lab._Sunday_9",
                                                "courseName":  "Introduction to Communication Systems - EEC2220",
                                                "courseCode":  "EEC2220",
                                                "group":  "L",
                                                "type":  "Lab.",
                                                "day":  "Sunday",
                                                "startSlot":  9,
                                                "endSlot":  10,
                                                "duration":  2,
                                                "instructor":  "ساندرين خالد محمود محمد حسن",
                                                "color":  "#10B981"
                                            },
                                            {
                                                "id":  "EEC2220_L_Sec._Monday_11",
                                                "courseName":  "Introduction to Communication Systems - EEC2220",
                                                "courseCode":  "EEC2220",
                                                "group":  "L",
                                                "type":  "Sec.",
                                                "day":  "Monday",
                                                "startSlot":  11,
                                                "endSlot":  12,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#10B981"
                                            },
                                            {
                                                "id":  "EEC2220_L_Lect._Tuesday_7",
                                                "courseName":  "Introduction to Communication Systems - EEC2220",
                                                "courseCode":  "EEC2220",
                                                "group":  "L",
                                                "type":  "Lect.",
                                                "day":  "Tuesday",
                                                "startSlot":  7,
                                                "endSlot":  8,
                                                "duration":  2,
                                                "instructor":  "د. حسين مصطفى صبحى العطار",
                                                "color":  "#10B981"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "ساندرين خالد محمود محمد حسن",
                                               "د. حسين مصطفى صبحى العطار"
                                           ]
                       },
                       {
                           "group":  "A",
                           "sessions":  [
                                            {
                                                "id":  "EEC2220_A_Sec._Monday_3",
                                                "courseName":  "Introduction to Communication Systems - EEC2220",
                                                "courseCode":  "EEC2220",
                                                "group":  "A",
                                                "type":  "Sec.",
                                                "day":  "Monday",
                                                "startSlot":  3,
                                                "endSlot":  4,
                                                "duration":  2,
                                                "instructor":  "مصطفى محمد السيد جودة",
                                                "color":  "#10B981"
                                            },
                                            {
                                                "id":  "EEC2220_A_Lab._Tuesday_5",
                                                "courseName":  "Introduction to Communication Systems - EEC2220",
                                                "courseCode":  "EEC2220",
                                                "group":  "A",
                                                "type":  "Lab.",
                                                "day":  "Tuesday",
                                                "startSlot":  5,
                                                "endSlot":  6,
                                                "duration":  2,
                                                "instructor":  "مصطفى محمد السيد جودة",
                                                "color":  "#10B981"
                                            },
                                            {
                                                "id":  "EEC2220_A_Lect._Thursday_7",
                                                "courseName":  "Introduction to Communication Systems - EEC2220",
                                                "courseCode":  "EEC2220",
                                                "group":  "A",
                                                "type":  "Lect.",
                                                "day":  "Thursday",
                                                "startSlot":  7,
                                                "endSlot":  8,
                                                "duration":  2,
                                                "instructor":  "د. البشير عادل يوسف محمد يوسف",
                                                "color":  "#10B981"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "مصطفى محمد السيد جودة",
                                               "د. البشير عادل يوسف محمد يوسف"
                                           ]
                       },
                       {
                           "group":  "F",
                           "sessions":  [
                                            {
                                                "id":  "EEC2220_F_Lab._Monday_9",
                                                "courseName":  "Introduction to Communication Systems - EEC2220",
                                                "courseCode":  "EEC2220",
                                                "group":  "F",
                                                "type":  "Lab.",
                                                "day":  "Monday",
                                                "startSlot":  9,
                                                "endSlot":  10,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#10B981"
                                            },
                                            {
                                                "id":  "EEC2220_F_Lect._Monday_3",
                                                "courseName":  "Introduction to Communication Systems - EEC2220",
                                                "courseCode":  "EEC2220",
                                                "group":  "F",
                                                "type":  "Lect.",
                                                "day":  "Monday",
                                                "startSlot":  3,
                                                "endSlot":  4,
                                                "duration":  2,
                                                "instructor":  "د. كريم احمد عبد الرحمن حموده حماد",
                                                "color":  "#10B981"
                                            },
                                            {
                                                "id":  "EEC2220_F_Sec._Thursday_3",
                                                "courseName":  "Introduction to Communication Systems - EEC2220",
                                                "courseCode":  "EEC2220",
                                                "group":  "F",
                                                "type":  "Sec.",
                                                "day":  "Thursday",
                                                "startSlot":  3,
                                                "endSlot":  4,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#10B981"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "د. كريم احمد عبد الرحمن حموده حماد"
                                           ]
                       }
                   ],
        "slots":  [
                      {
                          "id":  "EEC2220_D_Lab._Saturday_5",
                          "courseName":  "Introduction to Communication Systems - EEC2220",
                          "courseCode":  "EEC2220",
                          "group":  "D",
                          "type":  "Lab.",
                          "day":  "Saturday",
                          "startSlot":  5,
                          "endSlot":  6,
                          "duration":  2,
                          "instructor":  "احمد محمد عبدالوهاب دعبس",
                          "color":  "#10B981"
                      },
                      {
                          "id":  "EEC2220_I_Sec._Saturday_7",
                          "courseName":  "Introduction to Communication Systems - EEC2220",
                          "courseCode":  "EEC2220",
                          "group":  "I",
                          "type":  "Sec.",
                          "day":  "Saturday",
                          "startSlot":  7,
                          "endSlot":  8,
                          "duration":  2,
                          "instructor":  "ساندرين خالد محمود محمد حسن",
                          "color":  "#10B981"
                      },
                      {
                          "id":  "EEC2220_I_Lab._Saturday_9",
                          "courseName":  "Introduction to Communication Systems - EEC2220",
                          "courseCode":  "EEC2220",
                          "group":  "I",
                          "type":  "Lab.",
                          "day":  "Saturday",
                          "startSlot":  9,
                          "endSlot":  10,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#10B981"
                      },
                      {
                          "id":  "EEC2220_K_Lab._Saturday_11",
                          "courseName":  "Introduction to Communication Systems - EEC2220",
                          "courseCode":  "EEC2220",
                          "group":  "K",
                          "type":  "Lab.",
                          "day":  "Saturday",
                          "startSlot":  11,
                          "endSlot":  12,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#10B981"
                      },
                      {
                          "id":  "EEC2220_G_Lab._Saturday_5",
                          "courseName":  "Introduction to Communication Systems - EEC2220",
                          "courseCode":  "EEC2220",
                          "group":  "G",
                          "type":  "Lab.",
                          "day":  "Saturday",
                          "startSlot":  5,
                          "endSlot":  6,
                          "duration":  2,
                          "instructor":  "ساندرين خالد محمود محمد حسن",
                          "color":  "#10B981"
                      },
                      {
                          "id":  "EEC2220_J_Lab._Saturday_7",
                          "courseName":  "Introduction to Communication Systems - EEC2220",
                          "courseCode":  "EEC2220",
                          "group":  "J",
                          "type":  "Lab.",
                          "day":  "Saturday",
                          "startSlot":  7,
                          "endSlot":  8,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#10B981"
                      },
                      {
                          "id":  "EEC2220_K_Sec._Saturday_9",
                          "courseName":  "Introduction to Communication Systems - EEC2220",
                          "courseCode":  "EEC2220",
                          "group":  "K",
                          "type":  "Sec.",
                          "day":  "Saturday",
                          "startSlot":  9,
                          "endSlot":  10,
                          "duration":  2,
                          "instructor":  "ساندرين خالد محمود محمد حسن",
                          "color":  "#10B981"
                      },
                      {
                          "id":  "EEC2220_C_Lab._Sunday_3",
                          "courseName":  "Introduction to Communication Systems - EEC2220",
                          "courseCode":  "EEC2220",
                          "group":  "C",
                          "type":  "Lab.",
                          "day":  "Sunday",
                          "startSlot":  3,
                          "endSlot":  4,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#10B981"
                      },
                      {
                          "id":  "EEC2220_B_Lab._Sunday_5",
                          "courseName":  "Introduction to Communication Systems - EEC2220",
                          "courseCode":  "EEC2220",
                          "group":  "B",
                          "type":  "Lab.",
                          "day":  "Sunday",
                          "startSlot":  5,
                          "endSlot":  6,
                          "duration":  2,
                          "instructor":  "ساندرين خالد محمود محمد حسن",
                          "color":  "#10B981"
                      },
                      {
                          "id":  "EEC2220_C_Lect._Sunday_7",
                          "courseName":  "Introduction to Communication Systems - EEC2220",
                          "courseCode":  "EEC2220",
                          "group":  "C",
                          "type":  "Lect.",
                          "day":  "Sunday",
                          "startSlot":  7,
                          "endSlot":  8,
                          "duration":  2,
                          "instructor":  "د. البشير عادل يوسف محمد يوسف",
                          "color":  "#10B981"
                      },
                      {
                          "id":  "EEC2220_E_Lab._Sunday_9",
                          "courseName":  "Introduction to Communication Systems - EEC2220",
                          "courseCode":  "EEC2220",
                          "group":  "E",
                          "type":  "Lab.",
                          "day":  "Sunday",
                          "startSlot":  9,
                          "endSlot":  10,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#10B981"
                      },
                      {
                          "id":  "EEC2220_D_Lect._Sunday_7",
                          "courseName":  "Introduction to Communication Systems - EEC2220",
                          "courseCode":  "EEC2220",
                          "group":  "D",
                          "type":  "Lect.",
                          "day":  "Sunday",
                          "startSlot":  7,
                          "endSlot":  8,
                          "duration":  2,
                          "instructor":  "د. البشير عادل يوسف محمد يوسف",
                          "color":  "#10B981"
                      },
                      {
                          "id":  "EEC2220_G_Lect._Sunday_7",
                          "courseName":  "Introduction to Communication Systems - EEC2220",
                          "courseCode":  "EEC2220",
                          "group":  "G",
                          "type":  "Lect.",
                          "day":  "Sunday",
                          "startSlot":  7,
                          "endSlot":  8,
                          "duration":  2,
                          "instructor":  "د. حسين مصطفى صبحى العطار",
                          "color":  "#10B981"
                      },
                      {
                          "id":  "EEC2220_H_Lect._Sunday_7",
                          "courseName":  "Introduction to Communication Systems - EEC2220",
                          "courseCode":  "EEC2220",
                          "group":  "H",
                          "type":  "Lect.",
                          "day":  "Sunday",
                          "startSlot":  7,
                          "endSlot":  8,
                          "duration":  2,
                          "instructor":  "د. حسين مصطفى صبحى العطار",
                          "color":  "#10B981"
                      },
                      {
                          "id":  "EEC2220_L_Lab._Sunday_9",
                          "courseName":  "Introduction to Communication Systems - EEC2220",
                          "courseCode":  "EEC2220",
                          "group":  "L",
                          "type":  "Lab.",
                          "day":  "Sunday",
                          "startSlot":  9,
                          "endSlot":  10,
                          "duration":  2,
                          "instructor":  "ساندرين خالد محمود محمد حسن",
                          "color":  "#10B981"
                      },
                      {
                          "id":  "EEC2220_B_Sec._Monday_1",
                          "courseName":  "Introduction to Communication Systems - EEC2220",
                          "courseCode":  "EEC2220",
                          "group":  "B",
                          "type":  "Sec.",
                          "day":  "Monday",
                          "startSlot":  1,
                          "endSlot":  2,
                          "duration":  2,
                          "instructor":  "مصطفى محمد السيد جودة",
                          "color":  "#10B981"
                      },
                      {
                          "id":  "EEC2220_A_Sec._Monday_3",
                          "courseName":  "Introduction to Communication Systems - EEC2220",
                          "courseCode":  "EEC2220",
                          "group":  "A",
                          "type":  "Sec.",
                          "day":  "Monday",
                          "startSlot":  3,
                          "endSlot":  4,
                          "duration":  2,
                          "instructor":  "مصطفى محمد السيد جودة",
                          "color":  "#10B981"
                      },
                      {
                          "id":  "EEC2220_F_Lab._Monday_9",
                          "courseName":  "Introduction to Communication Systems - EEC2220",
                          "courseCode":  "EEC2220",
                          "group":  "F",
                          "type":  "Lab.",
                          "day":  "Monday",
                          "startSlot":  9,
                          "endSlot":  10,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#10B981"
                      },
                      {
                          "id":  "EEC2220_H_Lab._Monday_11",
                          "courseName":  "Introduction to Communication Systems - EEC2220",
                          "courseCode":  "EEC2220",
                          "group":  "H",
                          "type":  "Lab.",
                          "day":  "Monday",
                          "startSlot":  11,
                          "endSlot":  12,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#10B981"
                      },
                      {
                          "id":  "EEC2220_E_Lect._Monday_3",
                          "courseName":  "Introduction to Communication Systems - EEC2220",
                          "courseCode":  "EEC2220",
                          "group":  "E",
                          "type":  "Lect.",
                          "day":  "Monday",
                          "startSlot":  3,
                          "endSlot":  4,
                          "duration":  2,
                          "instructor":  "د. كريم احمد عبد الرحمن حموده حماد",
                          "color":  "#10B981"
                      },
                      {
                          "id":  "EEC2220_J_Sec._Monday_9",
                          "courseName":  "Introduction to Communication Systems - EEC2220",
                          "courseCode":  "EEC2220",
                          "group":  "J",
                          "type":  "Sec.",
                          "day":  "Monday",
                          "startSlot":  9,
                          "endSlot":  10,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#10B981"
                      },
                      {
                          "id":  "EEC2220_F_Lect._Monday_3",
                          "courseName":  "Introduction to Communication Systems - EEC2220",
                          "courseCode":  "EEC2220",
                          "group":  "F",
                          "type":  "Lect.",
                          "day":  "Monday",
                          "startSlot":  3,
                          "endSlot":  4,
                          "duration":  2,
                          "instructor":  "د. كريم احمد عبد الرحمن حموده حماد",
                          "color":  "#10B981"
                      },
                      {
                          "id":  "EEC2220_L_Sec._Monday_11",
                          "courseName":  "Introduction to Communication Systems - EEC2220",
                          "courseCode":  "EEC2220",
                          "group":  "L",
                          "type":  "Sec.",
                          "day":  "Monday",
                          "startSlot":  11,
                          "endSlot":  12,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#10B981"
                      },
                      {
                          "id":  "EEC2220_D_Sec._Tuesday_1",
                          "courseName":  "Introduction to Communication Systems - EEC2220",
                          "courseCode":  "EEC2220",
                          "group":  "D",
                          "type":  "Sec.",
                          "day":  "Tuesday",
                          "startSlot":  1,
                          "endSlot":  2,
                          "duration":  2,
                          "instructor":  "مصطفى محمد السيد جودة",
                          "color":  "#10B981"
                      },
                      {
                          "id":  "EEC2220_C_Sec._Tuesday_3",
                          "courseName":  "Introduction to Communication Systems - EEC2220",
                          "courseCode":  "EEC2220",
                          "group":  "C",
                          "type":  "Sec.",
                          "day":  "Tuesday",
                          "startSlot":  3,
                          "endSlot":  4,
                          "duration":  2,
                          "instructor":  "مصطفى محمد السيد جودة",
                          "color":  "#10B981"
                      },
                      {
                          "id":  "EEC2220_A_Lab._Tuesday_5",
                          "courseName":  "Introduction to Communication Systems - EEC2220",
                          "courseCode":  "EEC2220",
                          "group":  "A",
                          "type":  "Lab.",
                          "day":  "Tuesday",
                          "startSlot":  5,
                          "endSlot":  6,
                          "duration":  2,
                          "instructor":  "مصطفى محمد السيد جودة",
                          "color":  "#10B981"
                      },
                      {
                          "id":  "EEC2220_K_Lect._Tuesday_7",
                          "courseName":  "Introduction to Communication Systems - EEC2220",
                          "courseCode":  "EEC2220",
                          "group":  "K",
                          "type":  "Lect.",
                          "day":  "Tuesday",
                          "startSlot":  7,
                          "endSlot":  8,
                          "duration":  2,
                          "instructor":  "د. حسين مصطفى صبحى العطار",
                          "color":  "#10B981"
                      },
                      {
                          "id":  "EEC2220_L_Lect._Tuesday_7",
                          "courseName":  "Introduction to Communication Systems - EEC2220",
                          "courseCode":  "EEC2220",
                          "group":  "L",
                          "type":  "Lect.",
                          "day":  "Tuesday",
                          "startSlot":  7,
                          "endSlot":  8,
                          "duration":  2,
                          "instructor":  "د. حسين مصطفى صبحى العطار",
                          "color":  "#10B981"
                      },
                      {
                          "id":  "EEC2220_I_Lect._Wednesday_3",
                          "courseName":  "Introduction to Communication Systems - EEC2220",
                          "courseCode":  "EEC2220",
                          "group":  "I",
                          "type":  "Lect.",
                          "day":  "Wednesday",
                          "startSlot":  3,
                          "endSlot":  4,
                          "duration":  2,
                          "instructor":  "د. حسين مصطفى صبحى العطار",
                          "color":  "#10B981"
                      },
                      {
                          "id":  "EEC2220_G_Sec._Wednesday_7",
                          "courseName":  "Introduction to Communication Systems - EEC2220",
                          "courseCode":  "EEC2220",
                          "group":  "G",
                          "type":  "Sec.",
                          "day":  "Wednesday",
                          "startSlot":  7,
                          "endSlot":  8,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#10B981"
                      },
                      {
                          "id":  "EEC2220_H_Sec._Wednesday_11",
                          "courseName":  "Introduction to Communication Systems - EEC2220",
                          "courseCode":  "EEC2220",
                          "group":  "H",
                          "type":  "Sec.",
                          "day":  "Wednesday",
                          "startSlot":  11,
                          "endSlot":  12,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#10B981"
                      },
                      {
                          "id":  "EEC2220_J_Lect._Wednesday_3",
                          "courseName":  "Introduction to Communication Systems - EEC2220",
                          "courseCode":  "EEC2220",
                          "group":  "J",
                          "type":  "Lect.",
                          "day":  "Wednesday",
                          "startSlot":  3,
                          "endSlot":  4,
                          "duration":  2,
                          "instructor":  "د. حسين مصطفى صبحى العطار",
                          "color":  "#10B981"
                      },
                      {
                          "id":  "EEC2220_E_Sec._Thursday_1",
                          "courseName":  "Introduction to Communication Systems - EEC2220",
                          "courseCode":  "EEC2220",
                          "group":  "E",
                          "type":  "Sec.",
                          "day":  "Thursday",
                          "startSlot":  1,
                          "endSlot":  2,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#10B981"
                      },
                      {
                          "id":  "EEC2220_F_Sec._Thursday_3",
                          "courseName":  "Introduction to Communication Systems - EEC2220",
                          "courseCode":  "EEC2220",
                          "group":  "F",
                          "type":  "Sec.",
                          "day":  "Thursday",
                          "startSlot":  3,
                          "endSlot":  4,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#10B981"
                      },
                      {
                          "id":  "EEC2220_A_Lect._Thursday_7",
                          "courseName":  "Introduction to Communication Systems - EEC2220",
                          "courseCode":  "EEC2220",
                          "group":  "A",
                          "type":  "Lect.",
                          "day":  "Thursday",
                          "startSlot":  7,
                          "endSlot":  8,
                          "duration":  2,
                          "instructor":  "د. البشير عادل يوسف محمد يوسف",
                          "color":  "#10B981"
                      },
                      {
                          "id":  "EEC2220_B_Lect._Thursday_7",
                          "courseName":  "Introduction to Communication Systems - EEC2220",
                          "courseCode":  "EEC2220",
                          "group":  "B",
                          "type":  "Lect.",
                          "day":  "Thursday",
                          "startSlot":  7,
                          "endSlot":  8,
                          "duration":  2,
                          "instructor":  "د. البشير عادل يوسف محمد يوسف",
                          "color":  "#10B981"
                      }
                  ],
        "color":  "#10B981"
    },
    {
        "id":  "EBA2201",
        "name":  "Differential Equations - EBA2201",
        "code":  "EBA2201",
        "instructors":  [
                            "جمال كرم مصطفي محمد",
                            "د. سعيد انور محمد جوده",
                            "بيتر وجيه رشدى شاكر",
                            "د. الهيثم محمود عارف شبانة",
                            "رزان ايهاب جمال الدين محمد برعى",
                            "د. علا مصطفى محى الدين",
                            "جمانة محمد اغيد الدقاق",
                            "د. عصام احمد سليمان الصعيدى"
                        ],
        "groups":  [
                       {
                           "group":  "L",
                           "sessions":  [
                                            {
                                                "id":  "EBA2201_L_Sec._Saturday_1",
                                                "courseName":  "Differential Equations - EBA2201",
                                                "courseCode":  "EBA2201",
                                                "group":  "L",
                                                "type":  "Sec.",
                                                "day":  "Saturday",
                                                "startSlot":  1,
                                                "endSlot":  2,
                                                "duration":  2,
                                                "instructor":  "جمال كرم مصطفي محمد",
                                                "color":  "#F59E0B"
                                            },
                                            {
                                                "id":  "EBA2201_L_Lect._Saturday_3",
                                                "courseName":  "Differential Equations - EBA2201",
                                                "courseCode":  "EBA2201",
                                                "group":  "L",
                                                "type":  "Lect.",
                                                "day":  "Saturday",
                                                "startSlot":  3,
                                                "endSlot":  4,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#F59E0B"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "جمال كرم مصطفي محمد"
                                           ]
                       },
                       {
                           "group":  "A8",
                           "sessions":  [
                                            {
                                                "id":  "EBA2201_A8_Lect._Saturday_3",
                                                "courseName":  "Differential Equations - EBA2201",
                                                "courseCode":  "EBA2201",
                                                "group":  "A8",
                                                "type":  "Lect.",
                                                "day":  "Saturday",
                                                "startSlot":  3,
                                                "endSlot":  4,
                                                "duration":  2,
                                                "instructor":  "د. سعيد انور محمد جوده",
                                                "color":  "#F59E0B"
                                            },
                                            {
                                                "id":  "EBA2201_A8_Sec._Monday_3",
                                                "courseName":  "Differential Equations - EBA2201",
                                                "courseCode":  "EBA2201",
                                                "group":  "A8",
                                                "type":  "Sec.",
                                                "day":  "Monday",
                                                "startSlot":  3,
                                                "endSlot":  4,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#F59E0B"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "د. سعيد انور محمد جوده"
                                           ]
                       },
                       {
                           "group":  "I",
                           "sessions":  [
                                            {
                                                "id":  "EBA2201_I_Lect._Saturday_5",
                                                "courseName":  "Differential Equations - EBA2201",
                                                "courseCode":  "EBA2201",
                                                "group":  "I",
                                                "type":  "Lect.",
                                                "day":  "Saturday",
                                                "startSlot":  5,
                                                "endSlot":  6,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#F59E0B"
                                            },
                                            {
                                                "id":  "EBA2201_I_Sec._Saturday_3",
                                                "courseName":  "Differential Equations - EBA2201",
                                                "courseCode":  "EBA2201",
                                                "group":  "I",
                                                "type":  "Sec.",
                                                "day":  "Saturday",
                                                "startSlot":  3,
                                                "endSlot":  4,
                                                "duration":  2,
                                                "instructor":  "بيتر وجيه رشدى شاكر",
                                                "color":  "#F59E0B"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "بيتر وجيه رشدى شاكر"
                                           ]
                       },
                       {
                           "group":  "J",
                           "sessions":  [
                                            {
                                                "id":  "EBA2201_J_Sec._Saturday_7",
                                                "courseName":  "Differential Equations - EBA2201",
                                                "courseCode":  "EBA2201",
                                                "group":  "J",
                                                "type":  "Sec.",
                                                "day":  "Saturday",
                                                "startSlot":  7,
                                                "endSlot":  8,
                                                "duration":  2,
                                                "instructor":  "بيتر وجيه رشدى شاكر",
                                                "color":  "#F59E0B"
                                            },
                                            {
                                                "id":  "EBA2201_J_Lect._Saturday_5",
                                                "courseName":  "Differential Equations - EBA2201",
                                                "courseCode":  "EBA2201",
                                                "group":  "J",
                                                "type":  "Lect.",
                                                "day":  "Saturday",
                                                "startSlot":  5,
                                                "endSlot":  6,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#F59E0B"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "بيتر وجيه رشدى شاكر"
                                           ]
                       },
                       {
                           "group":  "A9",
                           "sessions":  [
                                            {
                                                "id":  "EBA2201_A9_Lect._Saturday_3",
                                                "courseName":  "Differential Equations - EBA2201",
                                                "courseCode":  "EBA2201",
                                                "group":  "A9",
                                                "type":  "Lect.",
                                                "day":  "Saturday",
                                                "startSlot":  3,
                                                "endSlot":  4,
                                                "duration":  2,
                                                "instructor":  "د. سعيد انور محمد جوده",
                                                "color":  "#F59E0B"
                                            },
                                            {
                                                "id":  "EBA2201_A9_Sec._Sunday_5",
                                                "courseName":  "Differential Equations - EBA2201",
                                                "courseCode":  "EBA2201",
                                                "group":  "A9",
                                                "type":  "Sec.",
                                                "day":  "Sunday",
                                                "startSlot":  5,
                                                "endSlot":  6,
                                                "duration":  2,
                                                "instructor":  "جمانة محمد اغيد الدقاق",
                                                "color":  "#F59E0B"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "د. سعيد انور محمد جوده",
                                               "جمانة محمد اغيد الدقاق"
                                           ]
                       },
                       {
                           "group":  "K",
                           "sessions":  [
                                            {
                                                "id":  "EBA2201_K_Lect._Saturday_3",
                                                "courseName":  "Differential Equations - EBA2201",
                                                "courseCode":  "EBA2201",
                                                "group":  "K",
                                                "type":  "Lect.",
                                                "day":  "Saturday",
                                                "startSlot":  3,
                                                "endSlot":  4,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#F59E0B"
                                            },
                                            {
                                                "id":  "EBA2201_K_Sec._Saturday_5",
                                                "courseName":  "Differential Equations - EBA2201",
                                                "courseCode":  "EBA2201",
                                                "group":  "K",
                                                "type":  "Sec.",
                                                "day":  "Saturday",
                                                "startSlot":  5,
                                                "endSlot":  6,
                                                "duration":  2,
                                                "instructor":  "بيتر وجيه رشدى شاكر",
                                                "color":  "#F59E0B"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "بيتر وجيه رشدى شاكر"
                                           ]
                       },
                       {
                           "group":  "N",
                           "sessions":  [
                                            {
                                                "id":  "EBA2201_N_Sec._Saturday_3",
                                                "courseName":  "Differential Equations - EBA2201",
                                                "courseCode":  "EBA2201",
                                                "group":  "N",
                                                "type":  "Sec.",
                                                "day":  "Saturday",
                                                "startSlot":  3,
                                                "endSlot":  4,
                                                "duration":  2,
                                                "instructor":  "جمال كرم مصطفي محمد",
                                                "color":  "#F59E0B"
                                            },
                                            {
                                                "id":  "EBA2201_N_Lect._Tuesday_1",
                                                "courseName":  "Differential Equations - EBA2201",
                                                "courseCode":  "EBA2201",
                                                "group":  "N",
                                                "type":  "Lect.",
                                                "day":  "Tuesday",
                                                "startSlot":  1,
                                                "endSlot":  2,
                                                "duration":  2,
                                                "instructor":  "د. عصام احمد سليمان الصعيدى",
                                                "color":  "#F59E0B"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "جمال كرم مصطفي محمد",
                                               "د. عصام احمد سليمان الصعيدى"
                                           ]
                       },
                       {
                           "group":  "M",
                           "sessions":  [
                                            {
                                                "id":  "EBA2201_M_Sec._Saturday_5",
                                                "courseName":  "Differential Equations - EBA2201",
                                                "courseCode":  "EBA2201",
                                                "group":  "M",
                                                "type":  "Sec.",
                                                "day":  "Saturday",
                                                "startSlot":  5,
                                                "endSlot":  6,
                                                "duration":  2,
                                                "instructor":  "جمال كرم مصطفي محمد",
                                                "color":  "#F59E0B"
                                            },
                                            {
                                                "id":  "EBA2201_M_Lect._Tuesday_1",
                                                "courseName":  "Differential Equations - EBA2201",
                                                "courseCode":  "EBA2201",
                                                "group":  "M",
                                                "type":  "Lect.",
                                                "day":  "Tuesday",
                                                "startSlot":  1,
                                                "endSlot":  2,
                                                "duration":  2,
                                                "instructor":  "د. عصام احمد سليمان الصعيدى",
                                                "color":  "#F59E0B"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "جمال كرم مصطفي محمد",
                                               "د. عصام احمد سليمان الصعيدى"
                                           ]
                       },
                       {
                           "group":  "O",
                           "sessions":  [
                                            {
                                                "id":  "EBA2201_O_Lect._Sunday_3",
                                                "courseName":  "Differential Equations - EBA2201",
                                                "courseCode":  "EBA2201",
                                                "group":  "O",
                                                "type":  "Lect.",
                                                "day":  "Sunday",
                                                "startSlot":  3,
                                                "endSlot":  4,
                                                "duration":  2,
                                                "instructor":  "د. الهيثم محمود عارف شبانة",
                                                "color":  "#F59E0B"
                                            },
                                            {
                                                "id":  "EBA2201_O_Sec._Tuesday_5",
                                                "courseName":  "Differential Equations - EBA2201",
                                                "courseCode":  "EBA2201",
                                                "group":  "O",
                                                "type":  "Sec.",
                                                "day":  "Tuesday",
                                                "startSlot":  5,
                                                "endSlot":  6,
                                                "duration":  2,
                                                "instructor":  "رزان ايهاب جمال الدين محمد برعى",
                                                "color":  "#F59E0B"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "د. الهيثم محمود عارف شبانة",
                                               "رزان ايهاب جمال الدين محمد برعى"
                                           ]
                       },
                       {
                           "group":  "A2",
                           "sessions":  [
                                            {
                                                "id":  "EBA2201_A2_Sec._Sunday_5",
                                                "courseName":  "Differential Equations - EBA2201",
                                                "courseCode":  "EBA2201",
                                                "group":  "A2",
                                                "type":  "Sec.",
                                                "day":  "Sunday",
                                                "startSlot":  5,
                                                "endSlot":  6,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#F59E0B"
                                            },
                                            {
                                                "id":  "EBA2201_A2_Lect._Sunday_9",
                                                "courseName":  "Differential Equations - EBA2201",
                                                "courseCode":  "EBA2201",
                                                "group":  "A2",
                                                "type":  "Lect.",
                                                "day":  "Sunday",
                                                "startSlot":  9,
                                                "endSlot":  10,
                                                "duration":  2,
                                                "instructor":  "د. علا مصطفى محى الدين",
                                                "color":  "#F59E0B"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "د. علا مصطفى محى الدين"
                                           ]
                       },
                       {
                           "group":  "B2",
                           "sessions":  [
                                            {
                                                "id":  "EBA2201_B2_Sec._Sunday_7",
                                                "courseName":  "Differential Equations - EBA2201",
                                                "courseCode":  "EBA2201",
                                                "group":  "B2",
                                                "type":  "Sec.",
                                                "day":  "Sunday",
                                                "startSlot":  7,
                                                "endSlot":  8,
                                                "duration":  2,
                                                "instructor":  "رزان ايهاب جمال الدين محمد برعى",
                                                "color":  "#F59E0B"
                                            },
                                            {
                                                "id":  "EBA2201_B2_Lect._Tuesday_3",
                                                "courseName":  "Differential Equations - EBA2201",
                                                "courseCode":  "EBA2201",
                                                "group":  "B2",
                                                "type":  "Lect.",
                                                "day":  "Tuesday",
                                                "startSlot":  3,
                                                "endSlot":  4,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#F59E0B"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "رزان ايهاب جمال الدين محمد برعى"
                                           ]
                       },
                       {
                           "group":  "P",
                           "sessions":  [
                                            {
                                                "id":  "EBA2201_P_Lect._Sunday_3",
                                                "courseName":  "Differential Equations - EBA2201",
                                                "courseCode":  "EBA2201",
                                                "group":  "P",
                                                "type":  "Lect.",
                                                "day":  "Sunday",
                                                "startSlot":  3,
                                                "endSlot":  4,
                                                "duration":  2,
                                                "instructor":  "د. الهيثم محمود عارف شبانة",
                                                "color":  "#F59E0B"
                                            },
                                            {
                                                "id":  "EBA2201_P_Sec._Tuesday_3",
                                                "courseName":  "Differential Equations - EBA2201",
                                                "courseCode":  "EBA2201",
                                                "group":  "P",
                                                "type":  "Sec.",
                                                "day":  "Tuesday",
                                                "startSlot":  3,
                                                "endSlot":  4,
                                                "duration":  2,
                                                "instructor":  "رزان ايهاب جمال الدين محمد برعى",
                                                "color":  "#F59E0B"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "د. الهيثم محمود عارف شبانة",
                                               "رزان ايهاب جمال الدين محمد برعى"
                                           ]
                       },
                       {
                           "group":  "R",
                           "sessions":  [
                                            {
                                                "id":  "EBA2201_R_Sec._Sunday_3",
                                                "courseName":  "Differential Equations - EBA2201",
                                                "courseCode":  "EBA2201",
                                                "group":  "R",
                                                "type":  "Sec.",
                                                "day":  "Sunday",
                                                "startSlot":  3,
                                                "endSlot":  4,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#F59E0B"
                                            },
                                            {
                                                "id":  "EBA2201_R_Lect._Sunday_5",
                                                "courseName":  "Differential Equations - EBA2201",
                                                "courseCode":  "EBA2201",
                                                "group":  "R",
                                                "type":  "Lect.",
                                                "day":  "Sunday",
                                                "startSlot":  5,
                                                "endSlot":  6,
                                                "duration":  2,
                                                "instructor":  "د. الهيثم محمود عارف شبانة",
                                                "color":  "#F59E0B"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "د. الهيثم محمود عارف شبانة"
                                           ]
                       },
                       {
                           "group":  "Q",
                           "sessions":  [
                                            {
                                                "id":  "EBA2201_Q_Lect._Sunday_5",
                                                "courseName":  "Differential Equations - EBA2201",
                                                "courseCode":  "EBA2201",
                                                "group":  "Q",
                                                "type":  "Lect.",
                                                "day":  "Sunday",
                                                "startSlot":  5,
                                                "endSlot":  6,
                                                "duration":  2,
                                                "instructor":  "د. الهيثم محمود عارف شبانة",
                                                "color":  "#F59E0B"
                                            },
                                            {
                                                "id":  "EBA2201_Q_Sec._Sunday_7",
                                                "courseName":  "Differential Equations - EBA2201",
                                                "courseCode":  "EBA2201",
                                                "group":  "Q",
                                                "type":  "Sec.",
                                                "day":  "Sunday",
                                                "startSlot":  7,
                                                "endSlot":  8,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#F59E0B"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "د. الهيثم محمود عارف شبانة"
                                           ]
                       },
                       {
                           "group":  "A3",
                           "sessions":  [
                                            {
                                                "id":  "EBA2201_A3_Lect._Sunday_9",
                                                "courseName":  "Differential Equations - EBA2201",
                                                "courseCode":  "EBA2201",
                                                "group":  "A3",
                                                "type":  "Lect.",
                                                "day":  "Sunday",
                                                "startSlot":  9,
                                                "endSlot":  10,
                                                "duration":  2,
                                                "instructor":  "د. علا مصطفى محى الدين",
                                                "color":  "#F59E0B"
                                            },
                                            {
                                                "id":  "EBA2201_A3_Sec._Tuesday_5",
                                                "courseName":  "Differential Equations - EBA2201",
                                                "courseCode":  "EBA2201",
                                                "group":  "A3",
                                                "type":  "Sec.",
                                                "day":  "Tuesday",
                                                "startSlot":  5,
                                                "endSlot":  6,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#F59E0B"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "د. علا مصطفى محى الدين"
                                           ]
                       },
                       {
                           "group":  "B0",
                           "sessions":  [
                                            {
                                                "id":  "EBA2201_B0_Lect._Tuesday_1",
                                                "courseName":  "Differential Equations - EBA2201",
                                                "courseCode":  "EBA2201",
                                                "group":  "B0",
                                                "type":  "Lect.",
                                                "day":  "Tuesday",
                                                "startSlot":  1,
                                                "endSlot":  2,
                                                "duration":  2,
                                                "instructor":  "د. سعيد انور محمد جوده",
                                                "color":  "#F59E0B"
                                            },
                                            {
                                                "id":  "EBA2201_B0_Sec._Wednesday_1",
                                                "courseName":  "Differential Equations - EBA2201",
                                                "courseCode":  "EBA2201",
                                                "group":  "B0",
                                                "type":  "Sec.",
                                                "day":  "Wednesday",
                                                "startSlot":  1,
                                                "endSlot":  2,
                                                "duration":  2,
                                                "instructor":  "جمانة محمد اغيد الدقاق",
                                                "color":  "#F59E0B"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "د. سعيد انور محمد جوده",
                                               "جمانة محمد اغيد الدقاق"
                                           ]
                       },
                       {
                           "group":  "A5",
                           "sessions":  [
                                            {
                                                "id":  "EBA2201_A5_Sec._Tuesday_3",
                                                "courseName":  "Differential Equations - EBA2201",
                                                "courseCode":  "EBA2201",
                                                "group":  "A5",
                                                "type":  "Sec.",
                                                "day":  "Tuesday",
                                                "startSlot":  3,
                                                "endSlot":  4,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#F59E0B"
                                            },
                                            {
                                                "id":  "EBA2201_A5_Lect._Wednesday_1",
                                                "courseName":  "Differential Equations - EBA2201",
                                                "courseCode":  "EBA2201",
                                                "group":  "A5",
                                                "type":  "Lect.",
                                                "day":  "Wednesday",
                                                "startSlot":  1,
                                                "endSlot":  2,
                                                "duration":  2,
                                                "instructor":  "د. علا مصطفى محى الدين",
                                                "color":  "#F59E0B"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "د. علا مصطفى محى الدين"
                                           ]
                       },
                       {
                           "group":  "A4",
                           "sessions":  [
                                            {
                                                "id":  "EBA2201_A4_Sec._Tuesday_7",
                                                "courseName":  "Differential Equations - EBA2201",
                                                "courseCode":  "EBA2201",
                                                "group":  "A4",
                                                "type":  "Sec.",
                                                "day":  "Tuesday",
                                                "startSlot":  7,
                                                "endSlot":  8,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#F59E0B"
                                            },
                                            {
                                                "id":  "EBA2201_A4_Lect._Wednesday_1",
                                                "courseName":  "Differential Equations - EBA2201",
                                                "courseCode":  "EBA2201",
                                                "group":  "A4",
                                                "type":  "Lect.",
                                                "day":  "Wednesday",
                                                "startSlot":  1,
                                                "endSlot":  2,
                                                "duration":  2,
                                                "instructor":  "د. علا مصطفى محى الدين",
                                                "color":  "#F59E0B"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "د. علا مصطفى محى الدين"
                                           ]
                       },
                       {
                           "group":  "B1",
                           "sessions":  [
                                            {
                                                "id":  "EBA2201_B1_Lect._Tuesday_1",
                                                "courseName":  "Differential Equations - EBA2201",
                                                "courseCode":  "EBA2201",
                                                "group":  "B1",
                                                "type":  "Lect.",
                                                "day":  "Tuesday",
                                                "startSlot":  1,
                                                "endSlot":  2,
                                                "duration":  2,
                                                "instructor":  "د. سعيد انور محمد جوده",
                                                "color":  "#F59E0B"
                                            },
                                            {
                                                "id":  "EBA2201_B1_Sec._Thursday_5",
                                                "courseName":  "Differential Equations - EBA2201",
                                                "courseCode":  "EBA2201",
                                                "group":  "B1",
                                                "type":  "Sec.",
                                                "day":  "Thursday",
                                                "startSlot":  5,
                                                "endSlot":  6,
                                                "duration":  2,
                                                "instructor":  "جمانة محمد اغيد الدقاق",
                                                "color":  "#F59E0B"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "د. سعيد انور محمد جوده",
                                               "جمانة محمد اغيد الدقاق"
                                           ]
                       },
                       {
                           "group":  "A6",
                           "sessions":  [
                                            {
                                                "id":  "EBA2201_A6_Lect._Tuesday_3",
                                                "courseName":  "Differential Equations - EBA2201",
                                                "courseCode":  "EBA2201",
                                                "group":  "A6",
                                                "type":  "Lect.",
                                                "day":  "Tuesday",
                                                "startSlot":  3,
                                                "endSlot":  4,
                                                "duration":  2,
                                                "instructor":  "د. عصام احمد سليمان الصعيدى",
                                                "color":  "#F59E0B"
                                            },
                                            {
                                                "id":  "EBA2201_A6_Sec._Wednesday_5",
                                                "courseName":  "Differential Equations - EBA2201",
                                                "courseCode":  "EBA2201",
                                                "group":  "A6",
                                                "type":  "Sec.",
                                                "day":  "Wednesday",
                                                "startSlot":  5,
                                                "endSlot":  6,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#F59E0B"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "د. عصام احمد سليمان الصعيدى"
                                           ]
                       },
                       {
                           "group":  "A7",
                           "sessions":  [
                                            {
                                                "id":  "EBA2201_A7_Lect._Tuesday_3",
                                                "courseName":  "Differential Equations - EBA2201",
                                                "courseCode":  "EBA2201",
                                                "group":  "A7",
                                                "type":  "Lect.",
                                                "day":  "Tuesday",
                                                "startSlot":  3,
                                                "endSlot":  4,
                                                "duration":  2,
                                                "instructor":  "د. عصام احمد سليمان الصعيدى",
                                                "color":  "#F59E0B"
                                            },
                                            {
                                                "id":  "EBA2201_A7_Sec._Wednesday_3",
                                                "courseName":  "Differential Equations - EBA2201",
                                                "courseCode":  "EBA2201",
                                                "group":  "A7",
                                                "type":  "Sec.",
                                                "day":  "Wednesday",
                                                "startSlot":  3,
                                                "endSlot":  4,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#F59E0B"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "د. عصام احمد سليمان الصعيدى"
                                           ]
                       }
                   ],
        "slots":  [
                      {
                          "id":  "EBA2201_L_Sec._Saturday_1",
                          "courseName":  "Differential Equations - EBA2201",
                          "courseCode":  "EBA2201",
                          "group":  "L",
                          "type":  "Sec.",
                          "day":  "Saturday",
                          "startSlot":  1,
                          "endSlot":  2,
                          "duration":  2,
                          "instructor":  "جمال كرم مصطفي محمد",
                          "color":  "#F59E0B"
                      },
                      {
                          "id":  "EBA2201_A8_Lect._Saturday_3",
                          "courseName":  "Differential Equations - EBA2201",
                          "courseCode":  "EBA2201",
                          "group":  "A8",
                          "type":  "Lect.",
                          "day":  "Saturday",
                          "startSlot":  3,
                          "endSlot":  4,
                          "duration":  2,
                          "instructor":  "د. سعيد انور محمد جوده",
                          "color":  "#F59E0B"
                      },
                      {
                          "id":  "EBA2201_I_Lect._Saturday_5",
                          "courseName":  "Differential Equations - EBA2201",
                          "courseCode":  "EBA2201",
                          "group":  "I",
                          "type":  "Lect.",
                          "day":  "Saturday",
                          "startSlot":  5,
                          "endSlot":  6,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#F59E0B"
                      },
                      {
                          "id":  "EBA2201_J_Sec._Saturday_7",
                          "courseName":  "Differential Equations - EBA2201",
                          "courseCode":  "EBA2201",
                          "group":  "J",
                          "type":  "Sec.",
                          "day":  "Saturday",
                          "startSlot":  7,
                          "endSlot":  8,
                          "duration":  2,
                          "instructor":  "بيتر وجيه رشدى شاكر",
                          "color":  "#F59E0B"
                      },
                      {
                          "id":  "EBA2201_A9_Lect._Saturday_3",
                          "courseName":  "Differential Equations - EBA2201",
                          "courseCode":  "EBA2201",
                          "group":  "A9",
                          "type":  "Lect.",
                          "day":  "Saturday",
                          "startSlot":  3,
                          "endSlot":  4,
                          "duration":  2,
                          "instructor":  "د. سعيد انور محمد جوده",
                          "color":  "#F59E0B"
                      },
                      {
                          "id":  "EBA2201_I_Sec._Saturday_3",
                          "courseName":  "Differential Equations - EBA2201",
                          "courseCode":  "EBA2201",
                          "group":  "I",
                          "type":  "Sec.",
                          "day":  "Saturday",
                          "startSlot":  3,
                          "endSlot":  4,
                          "duration":  2,
                          "instructor":  "بيتر وجيه رشدى شاكر",
                          "color":  "#F59E0B"
                      },
                      {
                          "id":  "EBA2201_K_Lect._Saturday_3",
                          "courseName":  "Differential Equations - EBA2201",
                          "courseCode":  "EBA2201",
                          "group":  "K",
                          "type":  "Lect.",
                          "day":  "Saturday",
                          "startSlot":  3,
                          "endSlot":  4,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#F59E0B"
                      },
                      {
                          "id":  "EBA2201_L_Lect._Saturday_3",
                          "courseName":  "Differential Equations - EBA2201",
                          "courseCode":  "EBA2201",
                          "group":  "L",
                          "type":  "Lect.",
                          "day":  "Saturday",
                          "startSlot":  3,
                          "endSlot":  4,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#F59E0B"
                      },
                      {
                          "id":  "EBA2201_N_Sec._Saturday_3",
                          "courseName":  "Differential Equations - EBA2201",
                          "courseCode":  "EBA2201",
                          "group":  "N",
                          "type":  "Sec.",
                          "day":  "Saturday",
                          "startSlot":  3,
                          "endSlot":  4,
                          "duration":  2,
                          "instructor":  "جمال كرم مصطفي محمد",
                          "color":  "#F59E0B"
                      },
                      {
                          "id":  "EBA2201_J_Lect._Saturday_5",
                          "courseName":  "Differential Equations - EBA2201",
                          "courseCode":  "EBA2201",
                          "group":  "J",
                          "type":  "Lect.",
                          "day":  "Saturday",
                          "startSlot":  5,
                          "endSlot":  6,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#F59E0B"
                      },
                      {
                          "id":  "EBA2201_K_Sec._Saturday_5",
                          "courseName":  "Differential Equations - EBA2201",
                          "courseCode":  "EBA2201",
                          "group":  "K",
                          "type":  "Sec.",
                          "day":  "Saturday",
                          "startSlot":  5,
                          "endSlot":  6,
                          "duration":  2,
                          "instructor":  "بيتر وجيه رشدى شاكر",
                          "color":  "#F59E0B"
                      },
                      {
                          "id":  "EBA2201_M_Sec._Saturday_5",
                          "courseName":  "Differential Equations - EBA2201",
                          "courseCode":  "EBA2201",
                          "group":  "M",
                          "type":  "Sec.",
                          "day":  "Saturday",
                          "startSlot":  5,
                          "endSlot":  6,
                          "duration":  2,
                          "instructor":  "جمال كرم مصطفي محمد",
                          "color":  "#F59E0B"
                      },
                      {
                          "id":  "EBA2201_O_Lect._Sunday_3",
                          "courseName":  "Differential Equations - EBA2201",
                          "courseCode":  "EBA2201",
                          "group":  "O",
                          "type":  "Lect.",
                          "day":  "Sunday",
                          "startSlot":  3,
                          "endSlot":  4,
                          "duration":  2,
                          "instructor":  "د. الهيثم محمود عارف شبانة",
                          "color":  "#F59E0B"
                      },
                      {
                          "id":  "EBA2201_A2_Sec._Sunday_5",
                          "courseName":  "Differential Equations - EBA2201",
                          "courseCode":  "EBA2201",
                          "group":  "A2",
                          "type":  "Sec.",
                          "day":  "Sunday",
                          "startSlot":  5,
                          "endSlot":  6,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#F59E0B"
                      },
                      {
                          "id":  "EBA2201_B2_Sec._Sunday_7",
                          "courseName":  "Differential Equations - EBA2201",
                          "courseCode":  "EBA2201",
                          "group":  "B2",
                          "type":  "Sec.",
                          "day":  "Sunday",
                          "startSlot":  7,
                          "endSlot":  8,
                          "duration":  2,
                          "instructor":  "رزان ايهاب جمال الدين محمد برعى",
                          "color":  "#F59E0B"
                      },
                      {
                          "id":  "EBA2201_A2_Lect._Sunday_9",
                          "courseName":  "Differential Equations - EBA2201",
                          "courseCode":  "EBA2201",
                          "group":  "A2",
                          "type":  "Lect.",
                          "day":  "Sunday",
                          "startSlot":  9,
                          "endSlot":  10,
                          "duration":  2,
                          "instructor":  "د. علا مصطفى محى الدين",
                          "color":  "#F59E0B"
                      },
                      {
                          "id":  "EBA2201_P_Lect._Sunday_3",
                          "courseName":  "Differential Equations - EBA2201",
                          "courseCode":  "EBA2201",
                          "group":  "P",
                          "type":  "Lect.",
                          "day":  "Sunday",
                          "startSlot":  3,
                          "endSlot":  4,
                          "duration":  2,
                          "instructor":  "د. الهيثم محمود عارف شبانة",
                          "color":  "#F59E0B"
                      },
                      {
                          "id":  "EBA2201_R_Sec._Sunday_3",
                          "courseName":  "Differential Equations - EBA2201",
                          "courseCode":  "EBA2201",
                          "group":  "R",
                          "type":  "Sec.",
                          "day":  "Sunday",
                          "startSlot":  3,
                          "endSlot":  4,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#F59E0B"
                      },
                      {
                          "id":  "EBA2201_A9_Sec._Sunday_5",
                          "courseName":  "Differential Equations - EBA2201",
                          "courseCode":  "EBA2201",
                          "group":  "A9",
                          "type":  "Sec.",
                          "day":  "Sunday",
                          "startSlot":  5,
                          "endSlot":  6,
                          "duration":  2,
                          "instructor":  "جمانة محمد اغيد الدقاق",
                          "color":  "#F59E0B"
                      },
                      {
                          "id":  "EBA2201_Q_Lect._Sunday_5",
                          "courseName":  "Differential Equations - EBA2201",
                          "courseCode":  "EBA2201",
                          "group":  "Q",
                          "type":  "Lect.",
                          "day":  "Sunday",
                          "startSlot":  5,
                          "endSlot":  6,
                          "duration":  2,
                          "instructor":  "د. الهيثم محمود عارف شبانة",
                          "color":  "#F59E0B"
                      },
                      {
                          "id":  "EBA2201_R_Lect._Sunday_5",
                          "courseName":  "Differential Equations - EBA2201",
                          "courseCode":  "EBA2201",
                          "group":  "R",
                          "type":  "Lect.",
                          "day":  "Sunday",
                          "startSlot":  5,
                          "endSlot":  6,
                          "duration":  2,
                          "instructor":  "د. الهيثم محمود عارف شبانة",
                          "color":  "#F59E0B"
                      },
                      {
                          "id":  "EBA2201_Q_Sec._Sunday_7",
                          "courseName":  "Differential Equations - EBA2201",
                          "courseCode":  "EBA2201",
                          "group":  "Q",
                          "type":  "Sec.",
                          "day":  "Sunday",
                          "startSlot":  7,
                          "endSlot":  8,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#F59E0B"
                      },
                      {
                          "id":  "EBA2201_A3_Lect._Sunday_9",
                          "courseName":  "Differential Equations - EBA2201",
                          "courseCode":  "EBA2201",
                          "group":  "A3",
                          "type":  "Lect.",
                          "day":  "Sunday",
                          "startSlot":  9,
                          "endSlot":  10,
                          "duration":  2,
                          "instructor":  "د. علا مصطفى محى الدين",
                          "color":  "#F59E0B"
                      },
                      {
                          "id":  "EBA2201_A8_Sec._Monday_3",
                          "courseName":  "Differential Equations - EBA2201",
                          "courseCode":  "EBA2201",
                          "group":  "A8",
                          "type":  "Sec.",
                          "day":  "Monday",
                          "startSlot":  3,
                          "endSlot":  4,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#F59E0B"
                      },
                      {
                          "id":  "EBA2201_B0_Lect._Tuesday_1",
                          "courseName":  "Differential Equations - EBA2201",
                          "courseCode":  "EBA2201",
                          "group":  "B0",
                          "type":  "Lect.",
                          "day":  "Tuesday",
                          "startSlot":  1,
                          "endSlot":  2,
                          "duration":  2,
                          "instructor":  "د. سعيد انور محمد جوده",
                          "color":  "#F59E0B"
                      },
                      {
                          "id":  "EBA2201_A5_Sec._Tuesday_3",
                          "courseName":  "Differential Equations - EBA2201",
                          "courseCode":  "EBA2201",
                          "group":  "A5",
                          "type":  "Sec.",
                          "day":  "Tuesday",
                          "startSlot":  3,
                          "endSlot":  4,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#F59E0B"
                      },
                      {
                          "id":  "EBA2201_A3_Sec._Tuesday_5",
                          "courseName":  "Differential Equations - EBA2201",
                          "courseCode":  "EBA2201",
                          "group":  "A3",
                          "type":  "Sec.",
                          "day":  "Tuesday",
                          "startSlot":  5,
                          "endSlot":  6,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#F59E0B"
                      },
                      {
                          "id":  "EBA2201_A4_Sec._Tuesday_7",
                          "courseName":  "Differential Equations - EBA2201",
                          "courseCode":  "EBA2201",
                          "group":  "A4",
                          "type":  "Sec.",
                          "day":  "Tuesday",
                          "startSlot":  7,
                          "endSlot":  8,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#F59E0B"
                      },
                      {
                          "id":  "EBA2201_B1_Lect._Tuesday_1",
                          "courseName":  "Differential Equations - EBA2201",
                          "courseCode":  "EBA2201",
                          "group":  "B1",
                          "type":  "Lect.",
                          "day":  "Tuesday",
                          "startSlot":  1,
                          "endSlot":  2,
                          "duration":  2,
                          "instructor":  "د. سعيد انور محمد جوده",
                          "color":  "#F59E0B"
                      },
                      {
                          "id":  "EBA2201_M_Lect._Tuesday_1",
                          "courseName":  "Differential Equations - EBA2201",
                          "courseCode":  "EBA2201",
                          "group":  "M",
                          "type":  "Lect.",
                          "day":  "Tuesday",
                          "startSlot":  1,
                          "endSlot":  2,
                          "duration":  2,
                          "instructor":  "د. عصام احمد سليمان الصعيدى",
                          "color":  "#F59E0B"
                      },
                      {
                          "id":  "EBA2201_N_Lect._Tuesday_1",
                          "courseName":  "Differential Equations - EBA2201",
                          "courseCode":  "EBA2201",
                          "group":  "N",
                          "type":  "Lect.",
                          "day":  "Tuesday",
                          "startSlot":  1,
                          "endSlot":  2,
                          "duration":  2,
                          "instructor":  "د. عصام احمد سليمان الصعيدى",
                          "color":  "#F59E0B"
                      },
                      {
                          "id":  "EBA2201_A6_Lect._Tuesday_3",
                          "courseName":  "Differential Equations - EBA2201",
                          "courseCode":  "EBA2201",
                          "group":  "A6",
                          "type":  "Lect.",
                          "day":  "Tuesday",
                          "startSlot":  3,
                          "endSlot":  4,
                          "duration":  2,
                          "instructor":  "د. عصام احمد سليمان الصعيدى",
                          "color":  "#F59E0B"
                      },
                      {
                          "id":  "EBA2201_A7_Lect._Tuesday_3",
                          "courseName":  "Differential Equations - EBA2201",
                          "courseCode":  "EBA2201",
                          "group":  "A7",
                          "type":  "Lect.",
                          "day":  "Tuesday",
                          "startSlot":  3,
                          "endSlot":  4,
                          "duration":  2,
                          "instructor":  "د. عصام احمد سليمان الصعيدى",
                          "color":  "#F59E0B"
                      },
                      {
                          "id":  "EBA2201_B2_Lect._Tuesday_3",
                          "courseName":  "Differential Equations - EBA2201",
                          "courseCode":  "EBA2201",
                          "group":  "B2",
                          "type":  "Lect.",
                          "day":  "Tuesday",
                          "startSlot":  3,
                          "endSlot":  4,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#F59E0B"
                      },
                      {
                          "id":  "EBA2201_P_Sec._Tuesday_3",
                          "courseName":  "Differential Equations - EBA2201",
                          "courseCode":  "EBA2201",
                          "group":  "P",
                          "type":  "Sec.",
                          "day":  "Tuesday",
                          "startSlot":  3,
                          "endSlot":  4,
                          "duration":  2,
                          "instructor":  "رزان ايهاب جمال الدين محمد برعى",
                          "color":  "#F59E0B"
                      },
                      {
                          "id":  "EBA2201_O_Sec._Tuesday_5",
                          "courseName":  "Differential Equations - EBA2201",
                          "courseCode":  "EBA2201",
                          "group":  "O",
                          "type":  "Sec.",
                          "day":  "Tuesday",
                          "startSlot":  5,
                          "endSlot":  6,
                          "duration":  2,
                          "instructor":  "رزان ايهاب جمال الدين محمد برعى",
                          "color":  "#F59E0B"
                      },
                      {
                          "id":  "EBA2201_A4_Lect._Wednesday_1",
                          "courseName":  "Differential Equations - EBA2201",
                          "courseCode":  "EBA2201",
                          "group":  "A4",
                          "type":  "Lect.",
                          "day":  "Wednesday",
                          "startSlot":  1,
                          "endSlot":  2,
                          "duration":  2,
                          "instructor":  "د. علا مصطفى محى الدين",
                          "color":  "#F59E0B"
                      },
                      {
                          "id":  "EBA2201_A7_Sec._Wednesday_3",
                          "courseName":  "Differential Equations - EBA2201",
                          "courseCode":  "EBA2201",
                          "group":  "A7",
                          "type":  "Sec.",
                          "day":  "Wednesday",
                          "startSlot":  3,
                          "endSlot":  4,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#F59E0B"
                      },
                      {
                          "id":  "EBA2201_A6_Sec._Wednesday_5",
                          "courseName":  "Differential Equations - EBA2201",
                          "courseCode":  "EBA2201",
                          "group":  "A6",
                          "type":  "Sec.",
                          "day":  "Wednesday",
                          "startSlot":  5,
                          "endSlot":  6,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#F59E0B"
                      },
                      {
                          "id":  "EBA2201_A5_Lect._Wednesday_1",
                          "courseName":  "Differential Equations - EBA2201",
                          "courseCode":  "EBA2201",
                          "group":  "A5",
                          "type":  "Lect.",
                          "day":  "Wednesday",
                          "startSlot":  1,
                          "endSlot":  2,
                          "duration":  2,
                          "instructor":  "د. علا مصطفى محى الدين",
                          "color":  "#F59E0B"
                      },
                      {
                          "id":  "EBA2201_B0_Sec._Wednesday_1",
                          "courseName":  "Differential Equations - EBA2201",
                          "courseCode":  "EBA2201",
                          "group":  "B0",
                          "type":  "Sec.",
                          "day":  "Wednesday",
                          "startSlot":  1,
                          "endSlot":  2,
                          "duration":  2,
                          "instructor":  "جمانة محمد اغيد الدقاق",
                          "color":  "#F59E0B"
                      },
                      {
                          "id":  "EBA2201_B1_Sec._Thursday_5",
                          "courseName":  "Differential Equations - EBA2201",
                          "courseCode":  "EBA2201",
                          "group":  "B1",
                          "type":  "Sec.",
                          "day":  "Thursday",
                          "startSlot":  5,
                          "endSlot":  6,
                          "duration":  2,
                          "instructor":  "جمانة محمد اغيد الدقاق",
                          "color":  "#F59E0B"
                      }
                  ],
        "color":  "#F59E0B"
    },
    {
        "id":  "ECE2201",
        "name":  "Digital Logic Design - ECE2201",
        "code":  "ECE2201",
        "instructors":  [
                            "محمد المدثر حسين احمد",
                            "ملك خالد ابراهيم محمد",
                            "د. احمد فهمى امين",
                            "د. سارة صابر بيومى الباجورى",
                            "د. دينا محمد علي ابو الدهب"
                        ],
        "groups":  [
                       {
                           "group":  "K",
                           "sessions":  [
                                            {
                                                "id":  "ECE2201_K_Lect._Saturday_1",
                                                "courseName":  "Digital Logic Design - ECE2201",
                                                "courseCode":  "ECE2201",
                                                "group":  "K",
                                                "type":  "Lect.",
                                                "day":  "Saturday",
                                                "startSlot":  1,
                                                "endSlot":  2,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#EC4899"
                                            },
                                            {
                                                "id":  "ECE2201_K_Lab._Saturday_11",
                                                "courseName":  "Digital Logic Design - ECE2201",
                                                "courseCode":  "ECE2201",
                                                "group":  "K",
                                                "type":  "Lab.",
                                                "day":  "Saturday",
                                                "startSlot":  11,
                                                "endSlot":  12,
                                                "duration":  2,
                                                "instructor":  "محمد المدثر حسين احمد",
                                                "color":  "#EC4899"
                                            },
                                            {
                                                "id":  "ECE2201_K_Sec._Sunday_9",
                                                "courseName":  "Digital Logic Design - ECE2201",
                                                "courseCode":  "ECE2201",
                                                "group":  "K",
                                                "type":  "Sec.",
                                                "day":  "Sunday",
                                                "startSlot":  9,
                                                "endSlot":  10,
                                                "duration":  2,
                                                "instructor":  "محمد المدثر حسين احمد",
                                                "color":  "#EC4899"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "محمد المدثر حسين احمد"
                                           ]
                       },
                       {
                           "group":  "E",
                           "sessions":  [
                                            {
                                                "id":  "ECE2201_E_Lab._Saturday_3",
                                                "courseName":  "Digital Logic Design - ECE2201",
                                                "courseCode":  "ECE2201",
                                                "group":  "E",
                                                "type":  "Lab.",
                                                "day":  "Saturday",
                                                "startSlot":  3,
                                                "endSlot":  4,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#EC4899"
                                            },
                                            {
                                                "id":  "ECE2201_E_Sec._Saturday_5",
                                                "courseName":  "Digital Logic Design - ECE2201",
                                                "courseCode":  "ECE2201",
                                                "group":  "E",
                                                "type":  "Sec.",
                                                "day":  "Saturday",
                                                "startSlot":  5,
                                                "endSlot":  6,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#EC4899"
                                            },
                                            {
                                                "id":  "ECE2201_E_Lect._Thursday_1",
                                                "courseName":  "Digital Logic Design - ECE2201",
                                                "courseCode":  "ECE2201",
                                                "group":  "E",
                                                "type":  "Lect.",
                                                "day":  "Thursday",
                                                "startSlot":  1,
                                                "endSlot":  2,
                                                "duration":  2,
                                                "instructor":  "د. سارة صابر بيومى الباجورى",
                                                "color":  "#EC4899"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "د. سارة صابر بيومى الباجورى"
                                           ]
                       },
                       {
                           "group":  "L",
                           "sessions":  [
                                            {
                                                "id":  "ECE2201_L_Lab._Saturday_7",
                                                "courseName":  "Digital Logic Design - ECE2201",
                                                "courseCode":  "ECE2201",
                                                "group":  "L",
                                                "type":  "Lab.",
                                                "day":  "Saturday",
                                                "startSlot":  7,
                                                "endSlot":  8,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#EC4899"
                                            },
                                            {
                                                "id":  "ECE2201_L_Lect._Saturday_1",
                                                "courseName":  "Digital Logic Design - ECE2201",
                                                "courseCode":  "ECE2201",
                                                "group":  "L",
                                                "type":  "Lect.",
                                                "day":  "Saturday",
                                                "startSlot":  1,
                                                "endSlot":  2,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#EC4899"
                                            },
                                            {
                                                "id":  "ECE2201_L_Sec._Saturday_9",
                                                "courseName":  "Digital Logic Design - ECE2201",
                                                "courseCode":  "ECE2201",
                                                "group":  "L",
                                                "type":  "Sec.",
                                                "day":  "Saturday",
                                                "startSlot":  9,
                                                "endSlot":  10,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#EC4899"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [

                                           ]
                       },
                       {
                           "group":  "H",
                           "sessions":  [
                                            {
                                                "id":  "ECE2201_H_Sec._Saturday_9",
                                                "courseName":  "Digital Logic Design - ECE2201",
                                                "courseCode":  "ECE2201",
                                                "group":  "H",
                                                "type":  "Sec.",
                                                "day":  "Saturday",
                                                "startSlot":  9,
                                                "endSlot":  10,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#EC4899"
                                            },
                                            {
                                                "id":  "ECE2201_H_Lab._Sunday_3",
                                                "courseName":  "Digital Logic Design - ECE2201",
                                                "courseCode":  "ECE2201",
                                                "group":  "H",
                                                "type":  "Lab.",
                                                "day":  "Sunday",
                                                "startSlot":  3,
                                                "endSlot":  4,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#EC4899"
                                            },
                                            {
                                                "id":  "ECE2201_H_Lect._Monday_1",
                                                "courseName":  "Digital Logic Design - ECE2201",
                                                "courseCode":  "ECE2201",
                                                "group":  "H",
                                                "type":  "Lect.",
                                                "day":  "Monday",
                                                "startSlot":  1,
                                                "endSlot":  2,
                                                "duration":  2,
                                                "instructor":  "د. سارة صابر بيومى الباجورى",
                                                "color":  "#EC4899"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "د. سارة صابر بيومى الباجورى"
                                           ]
                       },
                       {
                           "group":  "M",
                           "sessions":  [
                                            {
                                                "id":  "ECE2201_M_Lect._Saturday_3",
                                                "courseName":  "Digital Logic Design - ECE2201",
                                                "courseCode":  "ECE2201",
                                                "group":  "M",
                                                "type":  "Lect.",
                                                "day":  "Saturday",
                                                "startSlot":  3,
                                                "endSlot":  4,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#EC4899"
                                            },
                                            {
                                                "id":  "ECE2201_M_Lab._Monday_9",
                                                "courseName":  "Digital Logic Design - ECE2201",
                                                "courseCode":  "ECE2201",
                                                "group":  "M",
                                                "type":  "Lab.",
                                                "day":  "Monday",
                                                "startSlot":  9,
                                                "endSlot":  10,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#EC4899"
                                            },
                                            {
                                                "id":  "ECE2201_M_Sec._Thursday_9",
                                                "courseName":  "Digital Logic Design - ECE2201",
                                                "courseCode":  "ECE2201",
                                                "group":  "M",
                                                "type":  "Sec.",
                                                "day":  "Thursday",
                                                "startSlot":  9,
                                                "endSlot":  10,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#EC4899"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [

                                           ]
                       },
                       {
                           "group":  "N",
                           "sessions":  [
                                            {
                                                "id":  "ECE2201_N_Lect._Saturday_3",
                                                "courseName":  "Digital Logic Design - ECE2201",
                                                "courseCode":  "ECE2201",
                                                "group":  "N",
                                                "type":  "Lect.",
                                                "day":  "Saturday",
                                                "startSlot":  3,
                                                "endSlot":  4,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#EC4899"
                                            },
                                            {
                                                "id":  "ECE2201_N_Lab._Saturday_9",
                                                "courseName":  "Digital Logic Design - ECE2201",
                                                "courseCode":  "ECE2201",
                                                "group":  "N",
                                                "type":  "Lab.",
                                                "day":  "Saturday",
                                                "startSlot":  9,
                                                "endSlot":  10,
                                                "duration":  2,
                                                "instructor":  "محمد المدثر حسين احمد",
                                                "color":  "#EC4899"
                                            },
                                            {
                                                "id":  "ECE2201_N_Sec._Thursday_11",
                                                "courseName":  "Digital Logic Design - ECE2201",
                                                "courseCode":  "ECE2201",
                                                "group":  "N",
                                                "type":  "Sec.",
                                                "day":  "Thursday",
                                                "startSlot":  11,
                                                "endSlot":  12,
                                                "duration":  2,
                                                "instructor":  "محمد المدثر حسين احمد",
                                                "color":  "#EC4899"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "محمد المدثر حسين احمد"
                                           ]
                       },
                       {
                           "group":  "O",
                           "sessions":  [
                                            {
                                                "id":  "ECE2201_O_Sec._Saturday_3",
                                                "courseName":  "Digital Logic Design - ECE2201",
                                                "courseCode":  "ECE2201",
                                                "group":  "O",
                                                "type":  "Sec.",
                                                "day":  "Saturday",
                                                "startSlot":  3,
                                                "endSlot":  4,
                                                "duration":  2,
                                                "instructor":  "ملك خالد ابراهيم محمد",
                                                "color":  "#EC4899"
                                            },
                                            {
                                                "id":  "ECE2201_O_Lab._Saturday_5",
                                                "courseName":  "Digital Logic Design - ECE2201",
                                                "courseCode":  "ECE2201",
                                                "group":  "O",
                                                "type":  "Lab.",
                                                "day":  "Saturday",
                                                "startSlot":  5,
                                                "endSlot":  6,
                                                "duration":  2,
                                                "instructor":  "ملك خالد ابراهيم محمد",
                                                "color":  "#EC4899"
                                            },
                                            {
                                                "id":  "ECE2201_O_Lect._Sunday_3",
                                                "courseName":  "Digital Logic Design - ECE2201",
                                                "courseCode":  "ECE2201",
                                                "group":  "O",
                                                "type":  "Lect.",
                                                "day":  "Sunday",
                                                "startSlot":  3,
                                                "endSlot":  4,
                                                "duration":  2,
                                                "instructor":  "د. احمد فهمى امين",
                                                "color":  "#EC4899"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "ملك خالد ابراهيم محمد",
                                               "د. احمد فهمى امين"
                                           ]
                       },
                       {
                           "group":  "I",
                           "sessions":  [
                                            {
                                                "id":  "ECE2201_I_Lab._Sunday_5",
                                                "courseName":  "Digital Logic Design - ECE2201",
                                                "courseCode":  "ECE2201",
                                                "group":  "I",
                                                "type":  "Lab.",
                                                "day":  "Sunday",
                                                "startSlot":  5,
                                                "endSlot":  6,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#EC4899"
                                            },
                                            {
                                                "id":  "ECE2201_I_Sec._Sunday_7",
                                                "courseName":  "Digital Logic Design - ECE2201",
                                                "courseCode":  "ECE2201",
                                                "group":  "I",
                                                "type":  "Sec.",
                                                "day":  "Sunday",
                                                "startSlot":  7,
                                                "endSlot":  8,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#EC4899"
                                            },
                                            {
                                                "id":  "ECE2201_I_Lect._Thursday_5",
                                                "courseName":  "Digital Logic Design - ECE2201",
                                                "courseCode":  "ECE2201",
                                                "group":  "I",
                                                "type":  "Lect.",
                                                "day":  "Thursday",
                                                "startSlot":  5,
                                                "endSlot":  6,
                                                "duration":  2,
                                                "instructor":  "د. دينا محمد علي ابو الدهب",
                                                "color":  "#EC4899"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "د. دينا محمد علي ابو الدهب"
                                           ]
                       },
                       {
                           "group":  "J",
                           "sessions":  [
                                            {
                                                "id":  "ECE2201_J_Lab._Sunday_11",
                                                "courseName":  "Digital Logic Design - ECE2201",
                                                "courseCode":  "ECE2201",
                                                "group":  "J",
                                                "type":  "Lab.",
                                                "day":  "Sunday",
                                                "startSlot":  11,
                                                "endSlot":  12,
                                                "duration":  2,
                                                "instructor":  "محمد المدثر حسين احمد",
                                                "color":  "#EC4899"
                                            },
                                            {
                                                "id":  "ECE2201_J_Sec._Monday_7",
                                                "courseName":  "Digital Logic Design - ECE2201",
                                                "courseCode":  "ECE2201",
                                                "group":  "J",
                                                "type":  "Sec.",
                                                "day":  "Monday",
                                                "startSlot":  7,
                                                "endSlot":  8,
                                                "duration":  2,
                                                "instructor":  "محمد المدثر حسين احمد",
                                                "color":  "#EC4899"
                                            },
                                            {
                                                "id":  "ECE2201_J_Lect._Thursday_5",
                                                "courseName":  "Digital Logic Design - ECE2201",
                                                "courseCode":  "ECE2201",
                                                "group":  "J",
                                                "type":  "Lect.",
                                                "day":  "Thursday",
                                                "startSlot":  5,
                                                "endSlot":  6,
                                                "duration":  2,
                                                "instructor":  "د. دينا محمد علي ابو الدهب",
                                                "color":  "#EC4899"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "محمد المدثر حسين احمد",
                                               "د. دينا محمد علي ابو الدهب"
                                           ]
                       },
                       {
                           "group":  "P",
                           "sessions":  [
                                            {
                                                "id":  "ECE2201_P_Lect._Sunday_3",
                                                "courseName":  "Digital Logic Design - ECE2201",
                                                "courseCode":  "ECE2201",
                                                "group":  "P",
                                                "type":  "Lect.",
                                                "day":  "Sunday",
                                                "startSlot":  3,
                                                "endSlot":  4,
                                                "duration":  2,
                                                "instructor":  "د. احمد فهمى امين",
                                                "color":  "#EC4899"
                                            },
                                            {
                                                "id":  "ECE2201_P_Lab._Wednesday_9",
                                                "courseName":  "Digital Logic Design - ECE2201",
                                                "courseCode":  "ECE2201",
                                                "group":  "P",
                                                "type":  "Lab.",
                                                "day":  "Wednesday",
                                                "startSlot":  9,
                                                "endSlot":  10,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#EC4899"
                                            },
                                            {
                                                "id":  "ECE2201_P_Sec._Wednesday_11",
                                                "courseName":  "Digital Logic Design - ECE2201",
                                                "courseCode":  "ECE2201",
                                                "group":  "P",
                                                "type":  "Sec.",
                                                "day":  "Wednesday",
                                                "startSlot":  11,
                                                "endSlot":  12,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#EC4899"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "د. احمد فهمى امين"
                                           ]
                       },
                       {
                           "group":  "G",
                           "sessions":  [
                                            {
                                                "id":  "ECE2201_G_Lect._Monday_1",
                                                "courseName":  "Digital Logic Design - ECE2201",
                                                "courseCode":  "ECE2201",
                                                "group":  "G",
                                                "type":  "Lect.",
                                                "day":  "Monday",
                                                "startSlot":  1,
                                                "endSlot":  2,
                                                "duration":  2,
                                                "instructor":  "د. سارة صابر بيومى الباجورى",
                                                "color":  "#EC4899"
                                            },
                                            {
                                                "id":  "ECE2201_G_Sec._Tuesday_9",
                                                "courseName":  "Digital Logic Design - ECE2201",
                                                "courseCode":  "ECE2201",
                                                "group":  "G",
                                                "type":  "Sec.",
                                                "day":  "Tuesday",
                                                "startSlot":  9,
                                                "endSlot":  10,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#EC4899"
                                            },
                                            {
                                                "id":  "ECE2201_G_Lab._Tuesday_11",
                                                "courseName":  "Digital Logic Design - ECE2201",
                                                "courseCode":  "ECE2201",
                                                "group":  "G",
                                                "type":  "Lab.",
                                                "day":  "Tuesday",
                                                "startSlot":  11,
                                                "endSlot":  12,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#EC4899"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "د. سارة صابر بيومى الباجورى"
                                           ]
                       },
                       {
                           "group":  "F",
                           "sessions":  [
                                            {
                                                "id":  "ECE2201_F_Sec._Monday_3",
                                                "courseName":  "Digital Logic Design - ECE2201",
                                                "courseCode":  "ECE2201",
                                                "group":  "F",
                                                "type":  "Sec.",
                                                "day":  "Monday",
                                                "startSlot":  3,
                                                "endSlot":  4,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#EC4899"
                                            },
                                            {
                                                "id":  "ECE2201_F_Lab._Monday_5",
                                                "courseName":  "Digital Logic Design - ECE2201",
                                                "courseCode":  "ECE2201",
                                                "group":  "F",
                                                "type":  "Lab.",
                                                "day":  "Monday",
                                                "startSlot":  5,
                                                "endSlot":  6,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#EC4899"
                                            },
                                            {
                                                "id":  "ECE2201_F_Lect._Thursday_1",
                                                "courseName":  "Digital Logic Design - ECE2201",
                                                "courseCode":  "ECE2201",
                                                "group":  "F",
                                                "type":  "Lect.",
                                                "day":  "Thursday",
                                                "startSlot":  1,
                                                "endSlot":  2,
                                                "duration":  2,
                                                "instructor":  "د. سارة صابر بيومى الباجورى",
                                                "color":  "#EC4899"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "د. سارة صابر بيومى الباجورى"
                                           ]
                       }
                   ],
        "slots":  [
                      {
                          "id":  "ECE2201_K_Lect._Saturday_1",
                          "courseName":  "Digital Logic Design - ECE2201",
                          "courseCode":  "ECE2201",
                          "group":  "K",
                          "type":  "Lect.",
                          "day":  "Saturday",
                          "startSlot":  1,
                          "endSlot":  2,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#EC4899"
                      },
                      {
                          "id":  "ECE2201_E_Lab._Saturday_3",
                          "courseName":  "Digital Logic Design - ECE2201",
                          "courseCode":  "ECE2201",
                          "group":  "E",
                          "type":  "Lab.",
                          "day":  "Saturday",
                          "startSlot":  3,
                          "endSlot":  4,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#EC4899"
                      },
                      {
                          "id":  "ECE2201_E_Sec._Saturday_5",
                          "courseName":  "Digital Logic Design - ECE2201",
                          "courseCode":  "ECE2201",
                          "group":  "E",
                          "type":  "Sec.",
                          "day":  "Saturday",
                          "startSlot":  5,
                          "endSlot":  6,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#EC4899"
                      },
                      {
                          "id":  "ECE2201_L_Lab._Saturday_7",
                          "courseName":  "Digital Logic Design - ECE2201",
                          "courseCode":  "ECE2201",
                          "group":  "L",
                          "type":  "Lab.",
                          "day":  "Saturday",
                          "startSlot":  7,
                          "endSlot":  8,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#EC4899"
                      },
                      {
                          "id":  "ECE2201_H_Sec._Saturday_9",
                          "courseName":  "Digital Logic Design - ECE2201",
                          "courseCode":  "ECE2201",
                          "group":  "H",
                          "type":  "Sec.",
                          "day":  "Saturday",
                          "startSlot":  9,
                          "endSlot":  10,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#EC4899"
                      },
                      {
                          "id":  "ECE2201_K_Lab._Saturday_11",
                          "courseName":  "Digital Logic Design - ECE2201",
                          "courseCode":  "ECE2201",
                          "group":  "K",
                          "type":  "Lab.",
                          "day":  "Saturday",
                          "startSlot":  11,
                          "endSlot":  12,
                          "duration":  2,
                          "instructor":  "محمد المدثر حسين احمد",
                          "color":  "#EC4899"
                      },
                      {
                          "id":  "ECE2201_L_Lect._Saturday_1",
                          "courseName":  "Digital Logic Design - ECE2201",
                          "courseCode":  "ECE2201",
                          "group":  "L",
                          "type":  "Lect.",
                          "day":  "Saturday",
                          "startSlot":  1,
                          "endSlot":  2,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#EC4899"
                      },
                      {
                          "id":  "ECE2201_M_Lect._Saturday_3",
                          "courseName":  "Digital Logic Design - ECE2201",
                          "courseCode":  "ECE2201",
                          "group":  "M",
                          "type":  "Lect.",
                          "day":  "Saturday",
                          "startSlot":  3,
                          "endSlot":  4,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#EC4899"
                      },
                      {
                          "id":  "ECE2201_N_Lect._Saturday_3",
                          "courseName":  "Digital Logic Design - ECE2201",
                          "courseCode":  "ECE2201",
                          "group":  "N",
                          "type":  "Lect.",
                          "day":  "Saturday",
                          "startSlot":  3,
                          "endSlot":  4,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#EC4899"
                      },
                      {
                          "id":  "ECE2201_O_Sec._Saturday_3",
                          "courseName":  "Digital Logic Design - ECE2201",
                          "courseCode":  "ECE2201",
                          "group":  "O",
                          "type":  "Sec.",
                          "day":  "Saturday",
                          "startSlot":  3,
                          "endSlot":  4,
                          "duration":  2,
                          "instructor":  "ملك خالد ابراهيم محمد",
                          "color":  "#EC4899"
                      },
                      {
                          "id":  "ECE2201_L_Sec._Saturday_9",
                          "courseName":  "Digital Logic Design - ECE2201",
                          "courseCode":  "ECE2201",
                          "group":  "L",
                          "type":  "Sec.",
                          "day":  "Saturday",
                          "startSlot":  9,
                          "endSlot":  10,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#EC4899"
                      },
                      {
                          "id":  "ECE2201_O_Lab._Saturday_5",
                          "courseName":  "Digital Logic Design - ECE2201",
                          "courseCode":  "ECE2201",
                          "group":  "O",
                          "type":  "Lab.",
                          "day":  "Saturday",
                          "startSlot":  5,
                          "endSlot":  6,
                          "duration":  2,
                          "instructor":  "ملك خالد ابراهيم محمد",
                          "color":  "#EC4899"
                      },
                      {
                          "id":  "ECE2201_N_Lab._Saturday_9",
                          "courseName":  "Digital Logic Design - ECE2201",
                          "courseCode":  "ECE2201",
                          "group":  "N",
                          "type":  "Lab.",
                          "day":  "Saturday",
                          "startSlot":  9,
                          "endSlot":  10,
                          "duration":  2,
                          "instructor":  "محمد المدثر حسين احمد",
                          "color":  "#EC4899"
                      },
                      {
                          "id":  "ECE2201_H_Lab._Sunday_3",
                          "courseName":  "Digital Logic Design - ECE2201",
                          "courseCode":  "ECE2201",
                          "group":  "H",
                          "type":  "Lab.",
                          "day":  "Sunday",
                          "startSlot":  3,
                          "endSlot":  4,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#EC4899"
                      },
                      {
                          "id":  "ECE2201_I_Lab._Sunday_5",
                          "courseName":  "Digital Logic Design - ECE2201",
                          "courseCode":  "ECE2201",
                          "group":  "I",
                          "type":  "Lab.",
                          "day":  "Sunday",
                          "startSlot":  5,
                          "endSlot":  6,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#EC4899"
                      },
                      {
                          "id":  "ECE2201_I_Sec._Sunday_7",
                          "courseName":  "Digital Logic Design - ECE2201",
                          "courseCode":  "ECE2201",
                          "group":  "I",
                          "type":  "Sec.",
                          "day":  "Sunday",
                          "startSlot":  7,
                          "endSlot":  8,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#EC4899"
                      },
                      {
                          "id":  "ECE2201_K_Sec._Sunday_9",
                          "courseName":  "Digital Logic Design - ECE2201",
                          "courseCode":  "ECE2201",
                          "group":  "K",
                          "type":  "Sec.",
                          "day":  "Sunday",
                          "startSlot":  9,
                          "endSlot":  10,
                          "duration":  2,
                          "instructor":  "محمد المدثر حسين احمد",
                          "color":  "#EC4899"
                      },
                      {
                          "id":  "ECE2201_J_Lab._Sunday_11",
                          "courseName":  "Digital Logic Design - ECE2201",
                          "courseCode":  "ECE2201",
                          "group":  "J",
                          "type":  "Lab.",
                          "day":  "Sunday",
                          "startSlot":  11,
                          "endSlot":  12,
                          "duration":  2,
                          "instructor":  "محمد المدثر حسين احمد",
                          "color":  "#EC4899"
                      },
                      {
                          "id":  "ECE2201_O_Lect._Sunday_3",
                          "courseName":  "Digital Logic Design - ECE2201",
                          "courseCode":  "ECE2201",
                          "group":  "O",
                          "type":  "Lect.",
                          "day":  "Sunday",
                          "startSlot":  3,
                          "endSlot":  4,
                          "duration":  2,
                          "instructor":  "د. احمد فهمى امين",
                          "color":  "#EC4899"
                      },
                      {
                          "id":  "ECE2201_P_Lect._Sunday_3",
                          "courseName":  "Digital Logic Design - ECE2201",
                          "courseCode":  "ECE2201",
                          "group":  "P",
                          "type":  "Lect.",
                          "day":  "Sunday",
                          "startSlot":  3,
                          "endSlot":  4,
                          "duration":  2,
                          "instructor":  "د. احمد فهمى امين",
                          "color":  "#EC4899"
                      },
                      {
                          "id":  "ECE2201_G_Lect._Monday_1",
                          "courseName":  "Digital Logic Design - ECE2201",
                          "courseCode":  "ECE2201",
                          "group":  "G",
                          "type":  "Lect.",
                          "day":  "Monday",
                          "startSlot":  1,
                          "endSlot":  2,
                          "duration":  2,
                          "instructor":  "د. سارة صابر بيومى الباجورى",
                          "color":  "#EC4899"
                      },
                      {
                          "id":  "ECE2201_F_Sec._Monday_3",
                          "courseName":  "Digital Logic Design - ECE2201",
                          "courseCode":  "ECE2201",
                          "group":  "F",
                          "type":  "Sec.",
                          "day":  "Monday",
                          "startSlot":  3,
                          "endSlot":  4,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#EC4899"
                      },
                      {
                          "id":  "ECE2201_F_Lab._Monday_5",
                          "courseName":  "Digital Logic Design - ECE2201",
                          "courseCode":  "ECE2201",
                          "group":  "F",
                          "type":  "Lab.",
                          "day":  "Monday",
                          "startSlot":  5,
                          "endSlot":  6,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#EC4899"
                      },
                      {
                          "id":  "ECE2201_J_Sec._Monday_7",
                          "courseName":  "Digital Logic Design - ECE2201",
                          "courseCode":  "ECE2201",
                          "group":  "J",
                          "type":  "Sec.",
                          "day":  "Monday",
                          "startSlot":  7,
                          "endSlot":  8,
                          "duration":  2,
                          "instructor":  "محمد المدثر حسين احمد",
                          "color":  "#EC4899"
                      },
                      {
                          "id":  "ECE2201_M_Lab._Monday_9",
                          "courseName":  "Digital Logic Design - ECE2201",
                          "courseCode":  "ECE2201",
                          "group":  "M",
                          "type":  "Lab.",
                          "day":  "Monday",
                          "startSlot":  9,
                          "endSlot":  10,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#EC4899"
                      },
                      {
                          "id":  "ECE2201_H_Lect._Monday_1",
                          "courseName":  "Digital Logic Design - ECE2201",
                          "courseCode":  "ECE2201",
                          "group":  "H",
                          "type":  "Lect.",
                          "day":  "Monday",
                          "startSlot":  1,
                          "endSlot":  2,
                          "duration":  2,
                          "instructor":  "د. سارة صابر بيومى الباجورى",
                          "color":  "#EC4899"
                      },
                      {
                          "id":  "ECE2201_G_Sec._Tuesday_9",
                          "courseName":  "Digital Logic Design - ECE2201",
                          "courseCode":  "ECE2201",
                          "group":  "G",
                          "type":  "Sec.",
                          "day":  "Tuesday",
                          "startSlot":  9,
                          "endSlot":  10,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#EC4899"
                      },
                      {
                          "id":  "ECE2201_G_Lab._Tuesday_11",
                          "courseName":  "Digital Logic Design - ECE2201",
                          "courseCode":  "ECE2201",
                          "group":  "G",
                          "type":  "Lab.",
                          "day":  "Tuesday",
                          "startSlot":  11,
                          "endSlot":  12,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#EC4899"
                      },
                      {
                          "id":  "ECE2201_P_Lab._Wednesday_9",
                          "courseName":  "Digital Logic Design - ECE2201",
                          "courseCode":  "ECE2201",
                          "group":  "P",
                          "type":  "Lab.",
                          "day":  "Wednesday",
                          "startSlot":  9,
                          "endSlot":  10,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#EC4899"
                      },
                      {
                          "id":  "ECE2201_P_Sec._Wednesday_11",
                          "courseName":  "Digital Logic Design - ECE2201",
                          "courseCode":  "ECE2201",
                          "group":  "P",
                          "type":  "Sec.",
                          "day":  "Wednesday",
                          "startSlot":  11,
                          "endSlot":  12,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#EC4899"
                      },
                      {
                          "id":  "ECE2201_E_Lect._Thursday_1",
                          "courseName":  "Digital Logic Design - ECE2201",
                          "courseCode":  "ECE2201",
                          "group":  "E",
                          "type":  "Lect.",
                          "day":  "Thursday",
                          "startSlot":  1,
                          "endSlot":  2,
                          "duration":  2,
                          "instructor":  "د. سارة صابر بيومى الباجورى",
                          "color":  "#EC4899"
                      },
                      {
                          "id":  "ECE2201_I_Lect._Thursday_5",
                          "courseName":  "Digital Logic Design - ECE2201",
                          "courseCode":  "ECE2201",
                          "group":  "I",
                          "type":  "Lect.",
                          "day":  "Thursday",
                          "startSlot":  5,
                          "endSlot":  6,
                          "duration":  2,
                          "instructor":  "د. دينا محمد علي ابو الدهب",
                          "color":  "#EC4899"
                      },
                      {
                          "id":  "ECE2201_M_Sec._Thursday_9",
                          "courseName":  "Digital Logic Design - ECE2201",
                          "courseCode":  "ECE2201",
                          "group":  "M",
                          "type":  "Sec.",
                          "day":  "Thursday",
                          "startSlot":  9,
                          "endSlot":  10,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#EC4899"
                      },
                      {
                          "id":  "ECE2201_N_Sec._Thursday_11",
                          "courseName":  "Digital Logic Design - ECE2201",
                          "courseCode":  "ECE2201",
                          "group":  "N",
                          "type":  "Sec.",
                          "day":  "Thursday",
                          "startSlot":  11,
                          "endSlot":  12,
                          "duration":  2,
                          "instructor":  "محمد المدثر حسين احمد",
                          "color":  "#EC4899"
                      },
                      {
                          "id":  "ECE2201_F_Lect._Thursday_1",
                          "courseName":  "Digital Logic Design - ECE2201",
                          "courseCode":  "ECE2201",
                          "group":  "F",
                          "type":  "Lect.",
                          "day":  "Thursday",
                          "startSlot":  1,
                          "endSlot":  2,
                          "duration":  2,
                          "instructor":  "د. سارة صابر بيومى الباجورى",
                          "color":  "#EC4899"
                      },
                      {
                          "id":  "ECE2201_J_Lect._Thursday_5",
                          "courseName":  "Digital Logic Design - ECE2201",
                          "courseCode":  "ECE2201",
                          "group":  "J",
                          "type":  "Lect.",
                          "day":  "Thursday",
                          "startSlot":  5,
                          "endSlot":  6,
                          "duration":  2,
                          "instructor":  "د. دينا محمد علي ابو الدهب",
                          "color":  "#EC4899"
                      }
                  ],
        "color":  "#EC4899"
    },
    {
        "id":  "UNR2303",
        "name":  "Engineering Economy - UNR2303",
        "code":  "UNR2303",
        "instructors":  [
                            "د. محمود مصطفى محمد الاشوح",
                            "د. خالد عبدالعاطى محمد صلاح الدين",
                            "د. باسم حسام عمر رشدى",
                            "د. مجد الدين عبدالواحد محمد"
                        ],
        "groups":  [
                       {
                           "group":  "0",
                           "sessions":  [
                                            {
                                                "id":  "UNR2303_0_Lect._Monday_1",
                                                "courseName":  "Engineering Economy - UNR2303",
                                                "courseCode":  "UNR2303",
                                                "group":  "0",
                                                "type":  "Lect.",
                                                "day":  "Monday",
                                                "startSlot":  1,
                                                "endSlot":  2,
                                                "duration":  2,
                                                "instructor":  "د. خالد عبدالعاطى محمد صلاح الدين",
                                                "color":  "#06B6D4"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  false,
                           "instructors":  [
                                               "د. خالد عبدالعاطى محمد صلاح الدين"
                                           ]
                       },
                       {
                           "group":  "1",
                           "sessions":  [
                                            {
                                                "id":  "UNR2303_1_Lect._Monday_1",
                                                "courseName":  "Engineering Economy - UNR2303",
                                                "courseCode":  "UNR2303",
                                                "group":  "1",
                                                "type":  "Lect.",
                                                "day":  "Monday",
                                                "startSlot":  1,
                                                "endSlot":  2,
                                                "duration":  2,
                                                "instructor":  "د. خالد عبدالعاطى محمد صلاح الدين",
                                                "color":  "#06B6D4"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  false,
                           "instructors":  [
                                               "د. خالد عبدالعاطى محمد صلاح الدين"
                                           ]
                       },
                       {
                           "group":  "2",
                           "sessions":  [
                                            {
                                                "id":  "UNR2303_2_Lect._Tuesday_1",
                                                "courseName":  "Engineering Economy - UNR2303",
                                                "courseCode":  "UNR2303",
                                                "group":  "2",
                                                "type":  "Lect.",
                                                "day":  "Tuesday",
                                                "startSlot":  1,
                                                "endSlot":  2,
                                                "duration":  2,
                                                "instructor":  "د. باسم حسام عمر رشدى",
                                                "color":  "#06B6D4"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  false,
                           "instructors":  [
                                               "د. باسم حسام عمر رشدى"
                                           ]
                       },
                       {
                           "group":  "3",
                           "sessions":  [
                                            {
                                                "id":  "UNR2303_3_Lect._Tuesday_1",
                                                "courseName":  "Engineering Economy - UNR2303",
                                                "courseCode":  "UNR2303",
                                                "group":  "3",
                                                "type":  "Lect.",
                                                "day":  "Tuesday",
                                                "startSlot":  1,
                                                "endSlot":  2,
                                                "duration":  2,
                                                "instructor":  "د. باسم حسام عمر رشدى",
                                                "color":  "#06B6D4"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  false,
                           "instructors":  [
                                               "د. باسم حسام عمر رشدى"
                                           ]
                       },
                       {
                           "group":  "W",
                           "sessions":  [
                                            {
                                                "id":  "UNR2303_W_Lect._Monday_1",
                                                "courseName":  "Engineering Economy - UNR2303",
                                                "courseCode":  "UNR2303",
                                                "group":  "W",
                                                "type":  "Lect.",
                                                "day":  "Monday",
                                                "startSlot":  1,
                                                "endSlot":  2,
                                                "duration":  2,
                                                "instructor":  "د. محمود مصطفى محمد الاشوح",
                                                "color":  "#06B6D4"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  false,
                           "instructors":  [
                                               "د. محمود مصطفى محمد الاشوح"
                                           ]
                       },
                       {
                           "group":  "F",
                           "sessions":  [
                                            {
                                                "id":  "UNR2303_F_Lect._Monday_3",
                                                "courseName":  "Engineering Economy - UNR2303",
                                                "courseCode":  "UNR2303",
                                                "group":  "F",
                                                "type":  "Lect.",
                                                "day":  "Monday",
                                                "startSlot":  3,
                                                "endSlot":  4,
                                                "duration":  2,
                                                "instructor":  "د. خالد عبدالعاطى محمد صلاح الدين",
                                                "color":  "#06B6D4"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  false,
                           "instructors":  [
                                               "د. خالد عبدالعاطى محمد صلاح الدين"
                                           ]
                       },
                       {
                           "group":  "I",
                           "sessions":  [
                                            {
                                                "id":  "UNR2303_I_Lect._Monday_5",
                                                "courseName":  "Engineering Economy - UNR2303",
                                                "courseCode":  "UNR2303",
                                                "group":  "I",
                                                "type":  "Lect.",
                                                "day":  "Monday",
                                                "startSlot":  5,
                                                "endSlot":  6,
                                                "duration":  2,
                                                "instructor":  "د. خالد عبدالعاطى محمد صلاح الدين",
                                                "color":  "#06B6D4"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  false,
                           "instructors":  [
                                               "د. خالد عبدالعاطى محمد صلاح الدين"
                                           ]
                       },
                       {
                           "group":  "U",
                           "sessions":  [
                                            {
                                                "id":  "UNR2303_U_Lect._Monday_7",
                                                "courseName":  "Engineering Economy - UNR2303",
                                                "courseCode":  "UNR2303",
                                                "group":  "U",
                                                "type":  "Lect.",
                                                "day":  "Monday",
                                                "startSlot":  7,
                                                "endSlot":  8,
                                                "duration":  2,
                                                "instructor":  "د. محمود مصطفى محمد الاشوح",
                                                "color":  "#06B6D4"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  false,
                           "instructors":  [
                                               "د. محمود مصطفى محمد الاشوح"
                                           ]
                       },
                       {
                           "group":  "X",
                           "sessions":  [
                                            {
                                                "id":  "UNR2303_X_Lect._Monday_1",
                                                "courseName":  "Engineering Economy - UNR2303",
                                                "courseCode":  "UNR2303",
                                                "group":  "X",
                                                "type":  "Lect.",
                                                "day":  "Monday",
                                                "startSlot":  1,
                                                "endSlot":  2,
                                                "duration":  2,
                                                "instructor":  "د. محمود مصطفى محمد الاشوح",
                                                "color":  "#06B6D4"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  false,
                           "instructors":  [
                                               "د. محمود مصطفى محمد الاشوح"
                                           ]
                       },
                       {
                           "group":  "G",
                           "sessions":  [
                                            {
                                                "id":  "UNR2303_G_Lect._Monday_5",
                                                "courseName":  "Engineering Economy - UNR2303",
                                                "courseCode":  "UNR2303",
                                                "group":  "G",
                                                "type":  "Lect.",
                                                "day":  "Monday",
                                                "startSlot":  5,
                                                "endSlot":  6,
                                                "duration":  2,
                                                "instructor":  "د. محمود مصطفى محمد الاشوح",
                                                "color":  "#06B6D4"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  false,
                           "instructors":  [
                                               "د. محمود مصطفى محمد الاشوح"
                                           ]
                       },
                       {
                           "group":  "V",
                           "sessions":  [
                                            {
                                                "id":  "UNR2303_V_Lect._Monday_7",
                                                "courseName":  "Engineering Economy - UNR2303",
                                                "courseCode":  "UNR2303",
                                                "group":  "V",
                                                "type":  "Lect.",
                                                "day":  "Monday",
                                                "startSlot":  7,
                                                "endSlot":  8,
                                                "duration":  2,
                                                "instructor":  "د. محمود مصطفى محمد الاشوح",
                                                "color":  "#06B6D4"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  false,
                           "instructors":  [
                                               "د. محمود مصطفى محمد الاشوح"
                                           ]
                       },
                       {
                           "group":  "S",
                           "sessions":  [
                                            {
                                                "id":  "UNR2303_S_Lect._Tuesday_7",
                                                "courseName":  "Engineering Economy - UNR2303",
                                                "courseCode":  "UNR2303",
                                                "group":  "S",
                                                "type":  "Lect.",
                                                "day":  "Tuesday",
                                                "startSlot":  7,
                                                "endSlot":  8,
                                                "duration":  2,
                                                "instructor":  "د. محمود مصطفى محمد الاشوح",
                                                "color":  "#06B6D4"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  false,
                           "instructors":  [
                                               "د. محمود مصطفى محمد الاشوح"
                                           ]
                       },
                       {
                           "group":  "J",
                           "sessions":  [
                                            {
                                                "id":  "UNR2303_J_Lect._Tuesday_11",
                                                "courseName":  "Engineering Economy - UNR2303",
                                                "courseCode":  "UNR2303",
                                                "group":  "J",
                                                "type":  "Lect.",
                                                "day":  "Tuesday",
                                                "startSlot":  11,
                                                "endSlot":  12,
                                                "duration":  2,
                                                "instructor":  "د. محمود مصطفى محمد الاشوح",
                                                "color":  "#06B6D4"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  false,
                           "instructors":  [
                                               "د. محمود مصطفى محمد الاشوح"
                                           ]
                       },
                       {
                           "group":  "T",
                           "sessions":  [
                                            {
                                                "id":  "UNR2303_T_Lect._Tuesday_7",
                                                "courseName":  "Engineering Economy - UNR2303",
                                                "courseCode":  "UNR2303",
                                                "group":  "T",
                                                "type":  "Lect.",
                                                "day":  "Tuesday",
                                                "startSlot":  7,
                                                "endSlot":  8,
                                                "duration":  2,
                                                "instructor":  "د. محمود مصطفى محمد الاشوح",
                                                "color":  "#06B6D4"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  false,
                           "instructors":  [
                                               "د. محمود مصطفى محمد الاشوح"
                                           ]
                       },
                       {
                           "group":  "Y",
                           "sessions":  [
                                            {
                                                "id":  "UNR2303_Y_Lect._Tuesday_7",
                                                "courseName":  "Engineering Economy - UNR2303",
                                                "courseCode":  "UNR2303",
                                                "group":  "Y",
                                                "type":  "Lect.",
                                                "day":  "Tuesday",
                                                "startSlot":  7,
                                                "endSlot":  8,
                                                "duration":  2,
                                                "instructor":  "د. مجد الدين عبدالواحد محمد",
                                                "color":  "#06B6D4"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  false,
                           "instructors":  [
                                               "د. مجد الدين عبدالواحد محمد"
                                           ]
                       },
                       {
                           "group":  "Z",
                           "sessions":  [
                                            {
                                                "id":  "UNR2303_Z_Lect._Tuesday_7",
                                                "courseName":  "Engineering Economy - UNR2303",
                                                "courseCode":  "UNR2303",
                                                "group":  "Z",
                                                "type":  "Lect.",
                                                "day":  "Tuesday",
                                                "startSlot":  7,
                                                "endSlot":  8,
                                                "duration":  2,
                                                "instructor":  "د. مجد الدين عبدالواحد محمد",
                                                "color":  "#06B6D4"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  false,
                           "instructors":  [
                                               "د. مجد الدين عبدالواحد محمد"
                                           ]
                       },
                       {
                           "group":  "H",
                           "sessions":  [
                                            {
                                                "id":  "UNR2303_H_Lect._Wednesday_7",
                                                "courseName":  "Engineering Economy - UNR2303",
                                                "courseCode":  "UNR2303",
                                                "group":  "H",
                                                "type":  "Lect.",
                                                "day":  "Wednesday",
                                                "startSlot":  7,
                                                "endSlot":  8,
                                                "duration":  2,
                                                "instructor":  "د. محمود مصطفى محمد الاشوح",
                                                "color":  "#06B6D4"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  false,
                           "instructors":  [
                                               "د. محمود مصطفى محمد الاشوح"
                                           ]
                       }
                   ],
        "slots":  [
                      {
                          "id":  "UNR2303_W_Lect._Monday_1",
                          "courseName":  "Engineering Economy - UNR2303",
                          "courseCode":  "UNR2303",
                          "group":  "W",
                          "type":  "Lect.",
                          "day":  "Monday",
                          "startSlot":  1,
                          "endSlot":  2,
                          "duration":  2,
                          "instructor":  "د. محمود مصطفى محمد الاشوح",
                          "color":  "#06B6D4"
                      },
                      {
                          "id":  "UNR2303_F_Lect._Monday_3",
                          "courseName":  "Engineering Economy - UNR2303",
                          "courseCode":  "UNR2303",
                          "group":  "F",
                          "type":  "Lect.",
                          "day":  "Monday",
                          "startSlot":  3,
                          "endSlot":  4,
                          "duration":  2,
                          "instructor":  "د. خالد عبدالعاطى محمد صلاح الدين",
                          "color":  "#06B6D4"
                      },
                      {
                          "id":  "UNR2303_I_Lect._Monday_5",
                          "courseName":  "Engineering Economy - UNR2303",
                          "courseCode":  "UNR2303",
                          "group":  "I",
                          "type":  "Lect.",
                          "day":  "Monday",
                          "startSlot":  5,
                          "endSlot":  6,
                          "duration":  2,
                          "instructor":  "د. خالد عبدالعاطى محمد صلاح الدين",
                          "color":  "#06B6D4"
                      },
                      {
                          "id":  "UNR2303_U_Lect._Monday_7",
                          "courseName":  "Engineering Economy - UNR2303",
                          "courseCode":  "UNR2303",
                          "group":  "U",
                          "type":  "Lect.",
                          "day":  "Monday",
                          "startSlot":  7,
                          "endSlot":  8,
                          "duration":  2,
                          "instructor":  "د. محمود مصطفى محمد الاشوح",
                          "color":  "#06B6D4"
                      },
                      {
                          "id":  "UNR2303_X_Lect._Monday_1",
                          "courseName":  "Engineering Economy - UNR2303",
                          "courseCode":  "UNR2303",
                          "group":  "X",
                          "type":  "Lect.",
                          "day":  "Monday",
                          "startSlot":  1,
                          "endSlot":  2,
                          "duration":  2,
                          "instructor":  "د. محمود مصطفى محمد الاشوح",
                          "color":  "#06B6D4"
                      },
                      {
                          "id":  "UNR2303_0_Lect._Monday_1",
                          "courseName":  "Engineering Economy - UNR2303",
                          "courseCode":  "UNR2303",
                          "group":  "0",
                          "type":  "Lect.",
                          "day":  "Monday",
                          "startSlot":  1,
                          "endSlot":  2,
                          "duration":  2,
                          "instructor":  "د. خالد عبدالعاطى محمد صلاح الدين",
                          "color":  "#06B6D4"
                      },
                      {
                          "id":  "UNR2303_G_Lect._Monday_5",
                          "courseName":  "Engineering Economy - UNR2303",
                          "courseCode":  "UNR2303",
                          "group":  "G",
                          "type":  "Lect.",
                          "day":  "Monday",
                          "startSlot":  5,
                          "endSlot":  6,
                          "duration":  2,
                          "instructor":  "د. محمود مصطفى محمد الاشوح",
                          "color":  "#06B6D4"
                      },
                      {
                          "id":  "UNR2303_1_Lect._Monday_1",
                          "courseName":  "Engineering Economy - UNR2303",
                          "courseCode":  "UNR2303",
                          "group":  "1",
                          "type":  "Lect.",
                          "day":  "Monday",
                          "startSlot":  1,
                          "endSlot":  2,
                          "duration":  2,
                          "instructor":  "د. خالد عبدالعاطى محمد صلاح الدين",
                          "color":  "#06B6D4"
                      },
                      {
                          "id":  "UNR2303_V_Lect._Monday_7",
                          "courseName":  "Engineering Economy - UNR2303",
                          "courseCode":  "UNR2303",
                          "group":  "V",
                          "type":  "Lect.",
                          "day":  "Monday",
                          "startSlot":  7,
                          "endSlot":  8,
                          "duration":  2,
                          "instructor":  "د. محمود مصطفى محمد الاشوح",
                          "color":  "#06B6D4"
                      },
                      {
                          "id":  "UNR2303_2_Lect._Tuesday_1",
                          "courseName":  "Engineering Economy - UNR2303",
                          "courseCode":  "UNR2303",
                          "group":  "2",
                          "type":  "Lect.",
                          "day":  "Tuesday",
                          "startSlot":  1,
                          "endSlot":  2,
                          "duration":  2,
                          "instructor":  "د. باسم حسام عمر رشدى",
                          "color":  "#06B6D4"
                      },
                      {
                          "id":  "UNR2303_S_Lect._Tuesday_7",
                          "courseName":  "Engineering Economy - UNR2303",
                          "courseCode":  "UNR2303",
                          "group":  "S",
                          "type":  "Lect.",
                          "day":  "Tuesday",
                          "startSlot":  7,
                          "endSlot":  8,
                          "duration":  2,
                          "instructor":  "د. محمود مصطفى محمد الاشوح",
                          "color":  "#06B6D4"
                      },
                      {
                          "id":  "UNR2303_J_Lect._Tuesday_11",
                          "courseName":  "Engineering Economy - UNR2303",
                          "courseCode":  "UNR2303",
                          "group":  "J",
                          "type":  "Lect.",
                          "day":  "Tuesday",
                          "startSlot":  11,
                          "endSlot":  12,
                          "duration":  2,
                          "instructor":  "د. محمود مصطفى محمد الاشوح",
                          "color":  "#06B6D4"
                      },
                      {
                          "id":  "UNR2303_T_Lect._Tuesday_7",
                          "courseName":  "Engineering Economy - UNR2303",
                          "courseCode":  "UNR2303",
                          "group":  "T",
                          "type":  "Lect.",
                          "day":  "Tuesday",
                          "startSlot":  7,
                          "endSlot":  8,
                          "duration":  2,
                          "instructor":  "د. محمود مصطفى محمد الاشوح",
                          "color":  "#06B6D4"
                      },
                      {
                          "id":  "UNR2303_Y_Lect._Tuesday_7",
                          "courseName":  "Engineering Economy - UNR2303",
                          "courseCode":  "UNR2303",
                          "group":  "Y",
                          "type":  "Lect.",
                          "day":  "Tuesday",
                          "startSlot":  7,
                          "endSlot":  8,
                          "duration":  2,
                          "instructor":  "د. مجد الدين عبدالواحد محمد",
                          "color":  "#06B6D4"
                      },
                      {
                          "id":  "UNR2303_3_Lect._Tuesday_1",
                          "courseName":  "Engineering Economy - UNR2303",
                          "courseCode":  "UNR2303",
                          "group":  "3",
                          "type":  "Lect.",
                          "day":  "Tuesday",
                          "startSlot":  1,
                          "endSlot":  2,
                          "duration":  2,
                          "instructor":  "د. باسم حسام عمر رشدى",
                          "color":  "#06B6D4"
                      },
                      {
                          "id":  "UNR2303_Z_Lect._Tuesday_7",
                          "courseName":  "Engineering Economy - UNR2303",
                          "courseCode":  "UNR2303",
                          "group":  "Z",
                          "type":  "Lect.",
                          "day":  "Tuesday",
                          "startSlot":  7,
                          "endSlot":  8,
                          "duration":  2,
                          "instructor":  "د. مجد الدين عبدالواحد محمد",
                          "color":  "#06B6D4"
                      },
                      {
                          "id":  "UNR2303_H_Lect._Wednesday_7",
                          "courseName":  "Engineering Economy - UNR2303",
                          "courseCode":  "UNR2303",
                          "group":  "H",
                          "type":  "Lect.",
                          "day":  "Wednesday",
                          "startSlot":  7,
                          "endSlot":  8,
                          "duration":  2,
                          "instructor":  "د. محمود مصطفى محمد الاشوح",
                          "color":  "#06B6D4"
                      }
                  ],
        "color":  "#06B6D4"
    },
    {
        "id":  "ECE2402",
        "name":  "Numerical Methods - ECE2402",
        "code":  "ECE2402",
        "instructors":  [
                            "محمود ياسر محمود عبدالحميد",
                            "د. ريهام طاهر عبدالمجيد سالم المغربى",
                            "ماريز مدحت فوزى خله",
                            "د. فاطمه محمود مراد محمود"
                        ],
        "groups":  [
                       {
                           "group":  "B",
                           "sessions":  [
                                            {
                                                "id":  "ECE2402_B_Sec._Saturday_7",
                                                "courseName":  "Numerical Methods - ECE2402",
                                                "courseCode":  "ECE2402",
                                                "group":  "B",
                                                "type":  "Sec.",
                                                "day":  "Saturday",
                                                "startSlot":  7,
                                                "endSlot":  8,
                                                "duration":  2,
                                                "instructor":  "محمود ياسر محمود عبدالحميد",
                                                "color":  "#14B8A6"
                                            },
                                            {
                                                "id":  "ECE2402_B_Lect._Sunday_1",
                                                "courseName":  "Numerical Methods - ECE2402",
                                                "courseCode":  "ECE2402",
                                                "group":  "B",
                                                "type":  "Lect.",
                                                "day":  "Sunday",
                                                "startSlot":  1,
                                                "endSlot":  2,
                                                "duration":  2,
                                                "instructor":  "د. ريهام طاهر عبدالمجيد سالم المغربى",
                                                "color":  "#14B8A6"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "محمود ياسر محمود عبدالحميد",
                                               "د. ريهام طاهر عبدالمجيد سالم المغربى"
                                           ]
                       },
                       {
                           "group":  "A",
                           "sessions":  [
                                            {
                                                "id":  "ECE2402_A_Sec._Saturday_9",
                                                "courseName":  "Numerical Methods - ECE2402",
                                                "courseCode":  "ECE2402",
                                                "group":  "A",
                                                "type":  "Sec.",
                                                "day":  "Saturday",
                                                "startSlot":  9,
                                                "endSlot":  10,
                                                "duration":  2,
                                                "instructor":  "محمود ياسر محمود عبدالحميد",
                                                "color":  "#14B8A6"
                                            },
                                            {
                                                "id":  "ECE2402_A_Lect._Sunday_1",
                                                "courseName":  "Numerical Methods - ECE2402",
                                                "courseCode":  "ECE2402",
                                                "group":  "A",
                                                "type":  "Lect.",
                                                "day":  "Sunday",
                                                "startSlot":  1,
                                                "endSlot":  2,
                                                "duration":  2,
                                                "instructor":  "د. ريهام طاهر عبدالمجيد سالم المغربى",
                                                "color":  "#14B8A6"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "محمود ياسر محمود عبدالحميد",
                                               "د. ريهام طاهر عبدالمجيد سالم المغربى"
                                           ]
                       },
                       {
                           "group":  "F",
                           "sessions":  [
                                            {
                                                "id":  "ECE2402_F_Sec._Sunday_3",
                                                "courseName":  "Numerical Methods - ECE2402",
                                                "courseCode":  "ECE2402",
                                                "group":  "F",
                                                "type":  "Sec.",
                                                "day":  "Sunday",
                                                "startSlot":  3,
                                                "endSlot":  4,
                                                "duration":  2,
                                                "instructor":  "ماريز مدحت فوزى خله",
                                                "color":  "#14B8A6"
                                            },
                                            {
                                                "id":  "ECE2402_F_Lect._Tuesday_5",
                                                "courseName":  "Numerical Methods - ECE2402",
                                                "courseCode":  "ECE2402",
                                                "group":  "F",
                                                "type":  "Lect.",
                                                "day":  "Tuesday",
                                                "startSlot":  5,
                                                "endSlot":  6,
                                                "duration":  2,
                                                "instructor":  "د. ريهام طاهر عبدالمجيد سالم المغربى",
                                                "color":  "#14B8A6"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "ماريز مدحت فوزى خله",
                                               "د. ريهام طاهر عبدالمجيد سالم المغربى"
                                           ]
                       },
                       {
                           "group":  "E",
                           "sessions":  [
                                            {
                                                "id":  "ECE2402_E_Sec._Sunday_1",
                                                "courseName":  "Numerical Methods - ECE2402",
                                                "courseCode":  "ECE2402",
                                                "group":  "E",
                                                "type":  "Sec.",
                                                "day":  "Sunday",
                                                "startSlot":  1,
                                                "endSlot":  2,
                                                "duration":  2,
                                                "instructor":  "ماريز مدحت فوزى خله",
                                                "color":  "#14B8A6"
                                            },
                                            {
                                                "id":  "ECE2402_E_Lect._Tuesday_5",
                                                "courseName":  "Numerical Methods - ECE2402",
                                                "courseCode":  "ECE2402",
                                                "group":  "E",
                                                "type":  "Lect.",
                                                "day":  "Tuesday",
                                                "startSlot":  5,
                                                "endSlot":  6,
                                                "duration":  2,
                                                "instructor":  "د. ريهام طاهر عبدالمجيد سالم المغربى",
                                                "color":  "#14B8A6"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "ماريز مدحت فوزى خله",
                                               "د. ريهام طاهر عبدالمجيد سالم المغربى"
                                           ]
                       },
                       {
                           "group":  "G",
                           "sessions":  [
                                            {
                                                "id":  "ECE2402_G_Sec._Sunday_3",
                                                "courseName":  "Numerical Methods - ECE2402",
                                                "courseCode":  "ECE2402",
                                                "group":  "G",
                                                "type":  "Sec.",
                                                "day":  "Sunday",
                                                "startSlot":  3,
                                                "endSlot":  4,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#14B8A6"
                                            },
                                            {
                                                "id":  "ECE2402_G_Lect._Wednesday_5",
                                                "courseName":  "Numerical Methods - ECE2402",
                                                "courseCode":  "ECE2402",
                                                "group":  "G",
                                                "type":  "Lect.",
                                                "day":  "Wednesday",
                                                "startSlot":  5,
                                                "endSlot":  6,
                                                "duration":  2,
                                                "instructor":  "د. فاطمه محمود مراد محمود",
                                                "color":  "#14B8A6"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "د. فاطمه محمود مراد محمود"
                                           ]
                       },
                       {
                           "group":  "I",
                           "sessions":  [
                                            {
                                                "id":  "ECE2402_I_Lect._Monday_3",
                                                "courseName":  "Numerical Methods - ECE2402",
                                                "courseCode":  "ECE2402",
                                                "group":  "I",
                                                "type":  "Lect.",
                                                "day":  "Monday",
                                                "startSlot":  3,
                                                "endSlot":  4,
                                                "duration":  2,
                                                "instructor":  "د. فاطمه محمود مراد محمود",
                                                "color":  "#14B8A6"
                                            },
                                            {
                                                "id":  "ECE2402_I_Sec._Thursday_3",
                                                "courseName":  "Numerical Methods - ECE2402",
                                                "courseCode":  "ECE2402",
                                                "group":  "I",
                                                "type":  "Sec.",
                                                "day":  "Thursday",
                                                "startSlot":  3,
                                                "endSlot":  4,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#14B8A6"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "د. فاطمه محمود مراد محمود"
                                           ]
                       },
                       {
                           "group":  "C",
                           "sessions":  [
                                            {
                                                "id":  "ECE2402_C_Lect._Monday_5",
                                                "courseName":  "Numerical Methods - ECE2402",
                                                "courseCode":  "ECE2402",
                                                "group":  "C",
                                                "type":  "Lect.",
                                                "day":  "Monday",
                                                "startSlot":  5,
                                                "endSlot":  6,
                                                "duration":  2,
                                                "instructor":  "د. ريهام طاهر عبدالمجيد سالم المغربى",
                                                "color":  "#14B8A6"
                                            },
                                            {
                                                "id":  "ECE2402_C_Sec._Wednesday_11",
                                                "courseName":  "Numerical Methods - ECE2402",
                                                "courseCode":  "ECE2402",
                                                "group":  "C",
                                                "type":  "Sec.",
                                                "day":  "Wednesday",
                                                "startSlot":  11,
                                                "endSlot":  12,
                                                "duration":  2,
                                                "instructor":  "محمود ياسر محمود عبدالحميد",
                                                "color":  "#14B8A6"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "د. ريهام طاهر عبدالمجيد سالم المغربى",
                                               "محمود ياسر محمود عبدالحميد"
                                           ]
                       },
                       {
                           "group":  "J",
                           "sessions":  [
                                            {
                                                "id":  "ECE2402_J_Lect._Monday_3",
                                                "courseName":  "Numerical Methods - ECE2402",
                                                "courseCode":  "ECE2402",
                                                "group":  "J",
                                                "type":  "Lect.",
                                                "day":  "Monday",
                                                "startSlot":  3,
                                                "endSlot":  4,
                                                "duration":  2,
                                                "instructor":  "د. فاطمه محمود مراد محمود",
                                                "color":  "#14B8A6"
                                            },
                                            {
                                                "id":  "ECE2402_J_Sec._Tuesday_11",
                                                "courseName":  "Numerical Methods - ECE2402",
                                                "courseCode":  "ECE2402",
                                                "group":  "J",
                                                "type":  "Sec.",
                                                "day":  "Tuesday",
                                                "startSlot":  11,
                                                "endSlot":  12,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#14B8A6"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "د. فاطمه محمود مراد محمود"
                                           ]
                       },
                       {
                           "group":  "D",
                           "sessions":  [
                                            {
                                                "id":  "ECE2402_D_Lect._Monday_5",
                                                "courseName":  "Numerical Methods - ECE2402",
                                                "courseCode":  "ECE2402",
                                                "group":  "D",
                                                "type":  "Lect.",
                                                "day":  "Monday",
                                                "startSlot":  5,
                                                "endSlot":  6,
                                                "duration":  2,
                                                "instructor":  "د. ريهام طاهر عبدالمجيد سالم المغربى",
                                                "color":  "#14B8A6"
                                            },
                                            {
                                                "id":  "ECE2402_D_Sec._Wednesday_9",
                                                "courseName":  "Numerical Methods - ECE2402",
                                                "courseCode":  "ECE2402",
                                                "group":  "D",
                                                "type":  "Sec.",
                                                "day":  "Wednesday",
                                                "startSlot":  9,
                                                "endSlot":  10,
                                                "duration":  2,
                                                "instructor":  "محمود ياسر محمود عبدالحميد",
                                                "color":  "#14B8A6"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "د. ريهام طاهر عبدالمجيد سالم المغربى",
                                               "محمود ياسر محمود عبدالحميد"
                                           ]
                       },
                       {
                           "group":  "H",
                           "sessions":  [
                                            {
                                                "id":  "ECE2402_H_Sec._Tuesday_1",
                                                "courseName":  "Numerical Methods - ECE2402",
                                                "courseCode":  "ECE2402",
                                                "group":  "H",
                                                "type":  "Sec.",
                                                "day":  "Tuesday",
                                                "startSlot":  1,
                                                "endSlot":  2,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#14B8A6"
                                            },
                                            {
                                                "id":  "ECE2402_H_Lect._Wednesday_5",
                                                "courseName":  "Numerical Methods - ECE2402",
                                                "courseCode":  "ECE2402",
                                                "group":  "H",
                                                "type":  "Lect.",
                                                "day":  "Wednesday",
                                                "startSlot":  5,
                                                "endSlot":  6,
                                                "duration":  2,
                                                "instructor":  "د. فاطمه محمود مراد محمود",
                                                "color":  "#14B8A6"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [
                                               "د. فاطمه محمود مراد محمود"
                                           ]
                       },
                       {
                           "group":  "K",
                           "sessions":  [
                                            {
                                                "id":  "ECE2402_K_Lect._Wednesday_3",
                                                "courseName":  "Numerical Methods - ECE2402",
                                                "courseCode":  "ECE2402",
                                                "group":  "K",
                                                "type":  "Lect.",
                                                "day":  "Wednesday",
                                                "startSlot":  3,
                                                "endSlot":  4,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#14B8A6"
                                            },
                                            {
                                                "id":  "ECE2402_K_Sec._Thursday_11",
                                                "courseName":  "Numerical Methods - ECE2402",
                                                "courseCode":  "ECE2402",
                                                "group":  "K",
                                                "type":  "Sec.",
                                                "day":  "Thursday",
                                                "startSlot":  11,
                                                "endSlot":  12,
                                                "duration":  2,
                                                "instructor":  "Not Specified",
                                                "color":  "#14B8A6"
                                            }
                                        ],
                           "hasLecture":  true,
                           "hasLab":  true,
                           "instructors":  [

                                           ]
                       }
                   ],
        "slots":  [
                      {
                          "id":  "ECE2402_B_Sec._Saturday_7",
                          "courseName":  "Numerical Methods - ECE2402",
                          "courseCode":  "ECE2402",
                          "group":  "B",
                          "type":  "Sec.",
                          "day":  "Saturday",
                          "startSlot":  7,
                          "endSlot":  8,
                          "duration":  2,
                          "instructor":  "محمود ياسر محمود عبدالحميد",
                          "color":  "#14B8A6"
                      },
                      {
                          "id":  "ECE2402_A_Sec._Saturday_9",
                          "courseName":  "Numerical Methods - ECE2402",
                          "courseCode":  "ECE2402",
                          "group":  "A",
                          "type":  "Sec.",
                          "day":  "Saturday",
                          "startSlot":  9,
                          "endSlot":  10,
                          "duration":  2,
                          "instructor":  "محمود ياسر محمود عبدالحميد",
                          "color":  "#14B8A6"
                      },
                      {
                          "id":  "ECE2402_A_Lect._Sunday_1",
                          "courseName":  "Numerical Methods - ECE2402",
                          "courseCode":  "ECE2402",
                          "group":  "A",
                          "type":  "Lect.",
                          "day":  "Sunday",
                          "startSlot":  1,
                          "endSlot":  2,
                          "duration":  2,
                          "instructor":  "د. ريهام طاهر عبدالمجيد سالم المغربى",
                          "color":  "#14B8A6"
                      },
                      {
                          "id":  "ECE2402_F_Sec._Sunday_3",
                          "courseName":  "Numerical Methods - ECE2402",
                          "courseCode":  "ECE2402",
                          "group":  "F",
                          "type":  "Sec.",
                          "day":  "Sunday",
                          "startSlot":  3,
                          "endSlot":  4,
                          "duration":  2,
                          "instructor":  "ماريز مدحت فوزى خله",
                          "color":  "#14B8A6"
                      },
                      {
                          "id":  "ECE2402_B_Lect._Sunday_1",
                          "courseName":  "Numerical Methods - ECE2402",
                          "courseCode":  "ECE2402",
                          "group":  "B",
                          "type":  "Lect.",
                          "day":  "Sunday",
                          "startSlot":  1,
                          "endSlot":  2,
                          "duration":  2,
                          "instructor":  "د. ريهام طاهر عبدالمجيد سالم المغربى",
                          "color":  "#14B8A6"
                      },
                      {
                          "id":  "ECE2402_E_Sec._Sunday_1",
                          "courseName":  "Numerical Methods - ECE2402",
                          "courseCode":  "ECE2402",
                          "group":  "E",
                          "type":  "Sec.",
                          "day":  "Sunday",
                          "startSlot":  1,
                          "endSlot":  2,
                          "duration":  2,
                          "instructor":  "ماريز مدحت فوزى خله",
                          "color":  "#14B8A6"
                      },
                      {
                          "id":  "ECE2402_G_Sec._Sunday_3",
                          "courseName":  "Numerical Methods - ECE2402",
                          "courseCode":  "ECE2402",
                          "group":  "G",
                          "type":  "Sec.",
                          "day":  "Sunday",
                          "startSlot":  3,
                          "endSlot":  4,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#14B8A6"
                      },
                      {
                          "id":  "ECE2402_I_Lect._Monday_3",
                          "courseName":  "Numerical Methods - ECE2402",
                          "courseCode":  "ECE2402",
                          "group":  "I",
                          "type":  "Lect.",
                          "day":  "Monday",
                          "startSlot":  3,
                          "endSlot":  4,
                          "duration":  2,
                          "instructor":  "د. فاطمه محمود مراد محمود",
                          "color":  "#14B8A6"
                      },
                      {
                          "id":  "ECE2402_C_Lect._Monday_5",
                          "courseName":  "Numerical Methods - ECE2402",
                          "courseCode":  "ECE2402",
                          "group":  "C",
                          "type":  "Lect.",
                          "day":  "Monday",
                          "startSlot":  5,
                          "endSlot":  6,
                          "duration":  2,
                          "instructor":  "د. ريهام طاهر عبدالمجيد سالم المغربى",
                          "color":  "#14B8A6"
                      },
                      {
                          "id":  "ECE2402_J_Lect._Monday_3",
                          "courseName":  "Numerical Methods - ECE2402",
                          "courseCode":  "ECE2402",
                          "group":  "J",
                          "type":  "Lect.",
                          "day":  "Monday",
                          "startSlot":  3,
                          "endSlot":  4,
                          "duration":  2,
                          "instructor":  "د. فاطمه محمود مراد محمود",
                          "color":  "#14B8A6"
                      },
                      {
                          "id":  "ECE2402_D_Lect._Monday_5",
                          "courseName":  "Numerical Methods - ECE2402",
                          "courseCode":  "ECE2402",
                          "group":  "D",
                          "type":  "Lect.",
                          "day":  "Monday",
                          "startSlot":  5,
                          "endSlot":  6,
                          "duration":  2,
                          "instructor":  "د. ريهام طاهر عبدالمجيد سالم المغربى",
                          "color":  "#14B8A6"
                      },
                      {
                          "id":  "ECE2402_H_Sec._Tuesday_1",
                          "courseName":  "Numerical Methods - ECE2402",
                          "courseCode":  "ECE2402",
                          "group":  "H",
                          "type":  "Sec.",
                          "day":  "Tuesday",
                          "startSlot":  1,
                          "endSlot":  2,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#14B8A6"
                      },
                      {
                          "id":  "ECE2402_E_Lect._Tuesday_5",
                          "courseName":  "Numerical Methods - ECE2402",
                          "courseCode":  "ECE2402",
                          "group":  "E",
                          "type":  "Lect.",
                          "day":  "Tuesday",
                          "startSlot":  5,
                          "endSlot":  6,
                          "duration":  2,
                          "instructor":  "د. ريهام طاهر عبدالمجيد سالم المغربى",
                          "color":  "#14B8A6"
                      },
                      {
                          "id":  "ECE2402_J_Sec._Tuesday_11",
                          "courseName":  "Numerical Methods - ECE2402",
                          "courseCode":  "ECE2402",
                          "group":  "J",
                          "type":  "Sec.",
                          "day":  "Tuesday",
                          "startSlot":  11,
                          "endSlot":  12,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#14B8A6"
                      },
                      {
                          "id":  "ECE2402_F_Lect._Tuesday_5",
                          "courseName":  "Numerical Methods - ECE2402",
                          "courseCode":  "ECE2402",
                          "group":  "F",
                          "type":  "Lect.",
                          "day":  "Tuesday",
                          "startSlot":  5,
                          "endSlot":  6,
                          "duration":  2,
                          "instructor":  "د. ريهام طاهر عبدالمجيد سالم المغربى",
                          "color":  "#14B8A6"
                      },
                      {
                          "id":  "ECE2402_K_Lect._Wednesday_3",
                          "courseName":  "Numerical Methods - ECE2402",
                          "courseCode":  "ECE2402",
                          "group":  "K",
                          "type":  "Lect.",
                          "day":  "Wednesday",
                          "startSlot":  3,
                          "endSlot":  4,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#14B8A6"
                      },
                      {
                          "id":  "ECE2402_G_Lect._Wednesday_5",
                          "courseName":  "Numerical Methods - ECE2402",
                          "courseCode":  "ECE2402",
                          "group":  "G",
                          "type":  "Lect.",
                          "day":  "Wednesday",
                          "startSlot":  5,
                          "endSlot":  6,
                          "duration":  2,
                          "instructor":  "د. فاطمه محمود مراد محمود",
                          "color":  "#14B8A6"
                      },
                      {
                          "id":  "ECE2402_D_Sec._Wednesday_9",
                          "courseName":  "Numerical Methods - ECE2402",
                          "courseCode":  "ECE2402",
                          "group":  "D",
                          "type":  "Sec.",
                          "day":  "Wednesday",
                          "startSlot":  9,
                          "endSlot":  10,
                          "duration":  2,
                          "instructor":  "محمود ياسر محمود عبدالحميد",
                          "color":  "#14B8A6"
                      },
                      {
                          "id":  "ECE2402_C_Sec._Wednesday_11",
                          "courseName":  "Numerical Methods - ECE2402",
                          "courseCode":  "ECE2402",
                          "group":  "C",
                          "type":  "Sec.",
                          "day":  "Wednesday",
                          "startSlot":  11,
                          "endSlot":  12,
                          "duration":  2,
                          "instructor":  "محمود ياسر محمود عبدالحميد",
                          "color":  "#14B8A6"
                      },
                      {
                          "id":  "ECE2402_H_Lect._Wednesday_5",
                          "courseName":  "Numerical Methods - ECE2402",
                          "courseCode":  "ECE2402",
                          "group":  "H",
                          "type":  "Lect.",
                          "day":  "Wednesday",
                          "startSlot":  5,
                          "endSlot":  6,
                          "duration":  2,
                          "instructor":  "د. فاطمه محمود مراد محمود",
                          "color":  "#14B8A6"
                      },
                      {
                          "id":  "ECE2402_I_Sec._Thursday_3",
                          "courseName":  "Numerical Methods - ECE2402",
                          "courseCode":  "ECE2402",
                          "group":  "I",
                          "type":  "Sec.",
                          "day":  "Thursday",
                          "startSlot":  3,
                          "endSlot":  4,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#14B8A6"
                      },
                      {
                          "id":  "ECE2402_K_Sec._Thursday_11",
                          "courseName":  "Numerical Methods - ECE2402",
                          "courseCode":  "ECE2402",
                          "group":  "K",
                          "type":  "Sec.",
                          "day":  "Thursday",
                          "startSlot":  11,
                          "endSlot":  12,
                          "duration":  2,
                          "instructor":  "Not Specified",
                          "color":  "#14B8A6"
                      }
                  ],
        "color":  "#14B8A6"
    }
];

  const DEFAULT_MAJOR_CATALOG = {
    version: "1.0",
    defaultMajorId: "computing_heliopolis_2026_term1",
    majors: [
      {
        id: "computing_heliopolis_2026_term1",
        title: "كلية الحاسبات وتكنولوجيا المعلومات - مصر الجديدة",
        titleEn: "Faculty of Computing & Information Technology - Heliopolis",
        semester: "الأول 2027/2026",
        semesterEn: "Term 1 (2026/2027)",
        file: "colleges/computing_heliopolis_2026_term1.json",
        totalDepartments: 7,
        totalSchedules: 136,
        departments: [
          "الأمن السيبرانى - ق.م",
          "الذكاء الإصطناعي - ق.م",
          "علوم الحاسب ق.م",
          "علوم حاسب ق.م-Northampton",
          "نظم معلومات -ق م",
          "هندسة البرمجيات - ق.م",
          "هندسة برمجيات ق.م -Northampton"
        ]
      }
    ]
  };

  const DEFAULT_MAJOR_SCHEDULE_JSON = {
  "metadata": {
    "exportTitle": "الفصل الدراسي - الأول 2026-2027 -- كلية الحاسبات وتكنولوجيا المعلومات- مصر الجديدة",
    "portalHeader": "الفصل الدراسي: الأول 2026/2027 -- كلية الحاسبات وتكنولوجيا المعلومات- مصر الجديدة",
    "portalTitle": "",
    "batch": {
      "text": "الأول 2027/2026",
      "value": "1019"
    },
    "scrapedAt": "2026-09-07T22:14:13.795Z",
    "totalDepartments": 7,
    "totalSchedules": 136,
    "totalClassesFound": 8,
    "departmentsSummary": [
      {
        "department": "الأمن السيبرانى - ق.م",
        "departmentValue": "699,10",
        "totalSchedules": 19,
        "totalClasses": 4
      },
      {
        "department": "الذكاء الإصطناعي - ق.م",
        "departmentValue": "700,10",
        "totalSchedules": 13,
        "totalClasses": 0
      },
      {
        "department": "علوم الحاسب ق.م",
        "departmentValue": "29,10",
        "totalSchedules": 40,
        "totalClasses": 8
      },
      {
        "department": "علوم حاسب ق.م-Northampton",
        "departmentValue": "435,10",
        "totalSchedules": 8,
        "totalClasses": 0
      },
      {
        "department": "نظم معلومات -ق م",
        "departmentValue": "73,1",
        "totalSchedules": 19,
        "totalClasses": 0
      },
      {
        "department": "هندسة البرمجيات - ق.م",
        "departmentValue": "149,1",
        "totalSchedules": 29,
        "totalClasses": 0
      },
      {
        "department": "هندسة برمجيات ق.م -Northampton",
        "departmentValue": "435,30",
        "totalSchedules": 8,
        "totalClasses": 0
      }
    ]
  },
  "departmentsTree": {
    "الأمن السيبرانى - ق.م": {
      "departmentName": "الأمن السيبرانى - ق.م",
      "rawDepartmentLabel": "الأمن السيبرانى - ق.م",
      "departmentValue": "699,10",
      "totalSchedules": 19,
      "periods": {
        "1": {
          "periodName": "1",
          "periodValue": "1",
          "groups": {
            "Main": {
              "groupName": "--اختر المجموعة--",
              "groupValue": "-1",
              "hasTimetable": false,
              "timeSlots": [],
              "schedule": []
            }
          }
        },
        "2": {
          "periodName": "2",
          "periodValue": "2",
          "groups": {
            "2CS1": {
              "groupName": "2CS1",
              "groupValue": "2CS1",
              "hasTimetable": true,
              "pageMetadata": {
                "header": "الفصل الدراسي: الأول 2026/2027 -- كلية الحاسبات وتكنولوجيا المعلومات- مصر الجديدة",
                "title": "جدول الأمن السيبرانى - ق.م - الفترة 2 - المجموعة 2CS1",
                "scheduleType": "جدول مجموعة"
              },
              "timeSlots": [
                "الفترة 1 (08:30 - 10:30)",
                "الفترة 2 (10:30 - 12:30)",
                "الفترة 3 (12:30 - 02:30)",
                "الفترة 4 (02:30 - 04:30)"
              ],
              "courseColors": [
                { "courseCode": "SEC201", "courseName": "Network Security", "color": "#EC4899" },
                { "courseCode": "SEC205", "courseName": "Cryptography Fundamentals", "color": "#F59E0B" }
              ],
              "roomLegend": { "Hall 4": "Lecture Hall 4", "Lab 5": "Security Lab 5" },
              "schedule": [
                {
                  "day": "Sunday",
                  "sessions": [
                    {
                      "slotName": "الفترة 1 (08:30 - 10:30)",
                      "slotIndex": 1,
                      "courseCode": "SEC201",
                      "courseName": "Network Security",
                      "group": "2CS1",
                      "type": "Lect.",
                      "room": "Hall 4",
                      "instructor": "د. طارق محمود",
                      "bgColor": "#EC4899",
                      "colspan": 1,
                      "rawContent": "Network Security (SEC201)\nGroup: 2CS1\nLect.\nد. طارق محمود\nHall 4"
                    },
                    {
                      "slotName": "الفترة 2 (10:30 - 12:30)",
                      "slotIndex": 2,
                      "courseCode": "SEC201",
                      "courseName": "Network Security",
                      "group": "2CS1",
                      "type": "Lab.",
                      "room": "Lab 5",
                      "instructor": "م. زياد طارق",
                      "bgColor": "#EC4899",
                      "colspan": 1,
                      "rawContent": "Network Security (SEC201)\nGroup: 2CS1\nLab.\nم. زياد طارق\nLab 5"
                    }
                  ]
                },
                {
                  "day": "Tuesday",
                  "sessions": [
                    {
                      "slotName": "الفترة 3 (12:30 - 02:30)",
                      "slotIndex": 3,
                      "courseCode": "SEC205",
                      "courseName": "Cryptography Fundamentals",
                      "group": "2CS1",
                      "type": "Lect.",
                      "room": "Hall 5",
                      "instructor": "د. نادية فؤاد",
                      "bgColor": "#F59E0B",
                      "colspan": 1,
                      "rawContent": "Cryptography Fundamentals (SEC205)\nGroup: 2CS1\nLect.\nد. نادية فؤاد\nHall 5"
                    }
                  ]
                }
              ]
            }
          }
        },
        "3": {
          "periodName": "3",
          "periodValue": "3",
          "groups": {
            "3CS5": { "groupName": "3CS5", "groupValue": "3CS5", "hasTimetable": true, "schedule": [] }
          }
        },
        "4": {
          "periodName": "4",
          "periodValue": "4",
          "groups": {
            "4CS1": { "groupName": "4CS1", "groupValue": "4CS1", "hasTimetable": true, "schedule": [] },
            "4CS2": { "groupName": "4CS2", "groupValue": "4CS2", "hasTimetable": true, "schedule": [] },
            "4SE1": { "groupName": "4SE1", "groupValue": "4SE1", "hasTimetable": true, "schedule": [] }
          }
        },
        "5": {
          "periodName": "5",
          "periodValue": "5",
          "groups": {
            "5CY1": { "groupName": "5CY1", "groupValue": "5CY1", "hasTimetable": true, "schedule": [] },
            "5CY2": { "groupName": "5CY2", "groupValue": "5CY2", "hasTimetable": true, "schedule": [] },
            "5CY3": { "groupName": "5CY3", "groupValue": "5CY3", "hasTimetable": true, "schedule": [] }
          }
        },
        "6": { "periodName": "6", "periodValue": "6", "groups": {} },
        "7": { "periodName": "7", "periodValue": "7", "groups": {} },
        "8": { "periodName": "8", "periodValue": "8", "groups": {} }
      }
    },
    "الذكاء الإصطناعي - ق.م": {
      "departmentName": "الذكاء الإصطناعي - ق.م",
      "rawDepartmentLabel": "الذكاء الإصطناعي - ق.م",
      "departmentValue": "700,10",
      "totalSchedules": 13,
      "periods": {
        "1": { "periodName": "1", "periodValue": "1", "groups": {} },
        "2": { "periodName": "2", "periodValue": "2", "groups": {} },
        "5": { "periodName": "5", "periodValue": "5", "groups": {} },
        "7": { "periodName": "7", "periodValue": "7", "groups": {} }
      }
    },
    "علوم الحاسب ق.م": {
      "departmentName": "علوم الحاسب ق.م",
      "rawDepartmentLabel": "علوم الحاسب ق.م //",
      "departmentValue": "29,10",
      "totalSchedules": 40,
      "periods": {
        "1": {
          "periodName": "1",
          "periodValue": "1",
          "groups": {
            "1": { "groupName": "1", "groupValue": "1", "hasTimetable": true, "schedule": [] },
            "2": { "groupName": "2", "groupValue": "2", "hasTimetable": true, "schedule": [] }
          }
        },
        "2": {
          "periodName": "2",
          "periodValue": "2",
          "groups": {
            "2CS1": {
              "groupName": "2CS1",
              "groupValue": "2CS1",
              "hasTimetable": true,
              "timeSlots": [
                "الفترة 1 (08:30 - 10:30)",
                "الفترة 2 (10:30 - 12:30)",
                "الفترة 3 (12:30 - 02:30)",
                "الفترة 4 (02:30 - 04:30)"
              ],
              "courseColors": [
                { "courseCode": "CS211", "courseName": "Data Structures", "color": "#3B82F6" },
                { "courseCode": "CS241", "courseName": "Operating Systems", "color": "#10B981" },
                { "courseCode": "MATH201", "courseName": "Linear Algebra", "color": "#8B5CF6" }
              ],
              "roomLegend": { "Hall 1": "Lecture Hall 1", "Lab 2": "Computer Lab 2" },
              "schedule": [
                {
                  "day": "Saturday",
                  "sessions": [
                    {
                      "slotName": "الفترة 1 (08:30 - 10:30)",
                      "slotIndex": 1,
                      "courseCode": "CS211",
                      "courseName": "Data Structures",
                      "group": "2CS1",
                      "type": "Lect.",
                      "room": "Hall 1",
                      "instructor": "د. مصطفى الشافعي",
                      "bgColor": "#3B82F6",
                      "colspan": 1,
                      "rawContent": "Data Structures (CS211)\nGroup: 2CS1\nLect.\nد. مصطفى الشافعي\nHall 1"
                    },
                    {
                      "slotName": "الفترة 2 (10:30 - 12:30)",
                      "slotIndex": 2,
                      "courseCode": "CS211",
                      "courseName": "Data Structures",
                      "group": "2CS1",
                      "type": "Lab.",
                      "room": "Lab 2",
                      "instructor": "م. أحمد حسام",
                      "bgColor": "#3B82F6",
                      "colspan": 1,
                      "rawContent": "Data Structures (CS211)\nGroup: 2CS1\nLab.\nم. أحمد حسام\nLab 2"
                    }
                  ]
                },
                {
                  "day": "Monday",
                  "sessions": [
                    {
                      "slotName": "الفترة 2 (10:30 - 12:30)",
                      "slotIndex": 2,
                      "courseCode": "CS241",
                      "courseName": "Operating Systems",
                      "group": "2CS1",
                      "type": "Lect.",
                      "room": "Hall 2",
                      "instructor": "د. هالة عبد الرحمن",
                      "bgColor": "#10B981",
                      "colspan": 1,
                      "rawContent": "Operating Systems (CS241)\nGroup: 2CS1\nLect.\nد. هالة عبد الرحمن\nHall 2"
                    },
                    {
                      "slotName": "الفترة 3 (12:30 - 02:30)",
                      "slotIndex": 3,
                      "courseCode": "CS241",
                      "courseName": "Operating Systems",
                      "group": "2CS1",
                      "type": "Sec.",
                      "room": "Room 101",
                      "instructor": "م. سارة علي",
                      "bgColor": "#10B981",
                      "colspan": 1,
                      "rawContent": "Operating Systems (CS241)\nGroup: 2CS1\nSec.\nم. سارة علي\nRoom 101"
                    }
                  ]
                },
                {
                  "day": "Wednesday",
                  "sessions": [
                    {
                      "slotName": "الفترة 1 (08:30 - 10:30)",
                      "slotIndex": 1,
                      "courseCode": "MATH201",
                      "courseName": "Linear Algebra",
                      "group": "2CS1",
                      "type": "Lect.",
                      "room": "Hall 3",
                      "instructor": "د. كمال النجار",
                      "bgColor": "#8B5CF6",
                      "colspan": 1,
                      "rawContent": "Linear Algebra (MATH201)\nGroup: 2CS1\nLect.\nد. كمال النجار\nHall 3"
                    }
                  ]
                }
              ]
            },
            "2CS2-Science": {
              "groupName": "2CS2-Science",
              "groupValue": "2CS2-Science",
              "hasTimetable": true,
              "timeSlots": [
                "الفترة 1 (08:30 - 10:30)",
                "الفترة 2 (10:30 - 12:30)",
                "الفترة 3 (12:30 - 02:30)",
                "الفترة 4 (02:30 - 04:30)"
              ],
              "schedule": [
                {
                  "day": "Sunday",
                  "sessions": [
                    {
                      "slotName": "الفترة 2 (10:30 - 12:30)",
                      "slotIndex": 2,
                      "courseCode": "CS211",
                      "courseName": "Data Structures",
                      "group": "2CS2-Science",
                      "type": "Lect.",
                      "room": "Hall 1",
                      "instructor": "د. يوسف إبراهيم",
                      "bgColor": "#3B82F6",
                      "colspan": 1,
                      "rawContent": "Data Structures (CS211)\nGroup: 2CS2-Science\nLect.\nد. يوسف إبراهيم\nHall 1"
                    },
                    {
                      "slotName": "الفترة 3 (12:30 - 02:30)",
                      "slotIndex": 3,
                      "courseCode": "CS211",
                      "courseName": "Data Structures",
                      "group": "2CS2-Science",
                      "type": "Lab.",
                      "room": "Lab 3",
                      "instructor": "م. أحمد حسام",
                      "bgColor": "#3B82F6",
                      "colspan": 1,
                      "rawContent": "Data Structures (CS211)\nGroup: 2CS2-Science\nLab.\nم. أحمد حسام\nLab 3"
                    }
                  ]
                },
                {
                  "day": "Tuesday",
                  "sessions": [
                    {
                      "slotName": "الفترة 1 (08:30 - 10:30)",
                      "slotIndex": 1,
                      "courseCode": "CS241",
                      "courseName": "Operating Systems",
                      "group": "2CS2-Science",
                      "type": "Lect.",
                      "room": "Hall 2",
                      "instructor": "د. هالة عبد الرحمن",
                      "bgColor": "#10B981",
                      "colspan": 1,
                      "rawContent": "Operating Systems (CS241)\nGroup: 2CS2-Science\nLect.\nد. هالة عبد الرحمن\nHall 2"
                    },
                    {
                      "slotName": "الفترة 2 (10:30 - 12:30)",
                      "slotIndex": 2,
                      "courseCode": "CS241",
                      "courseName": "Operating Systems",
                      "group": "2CS2-Science",
                      "type": "Sec.",
                      "room": "Room 102",
                      "instructor": "م. سارة علي",
                      "bgColor": "#10B981",
                      "colspan": 1,
                      "rawContent": "Operating Systems (CS241)\nGroup: 2CS2-Science\nSec.\nم. سارة علي\nRoom 102"
                    }
                  ]
                },
                {
                  "day": "Thursday",
                  "sessions": [
                    {
                      "slotName": "الفترة 2 (10:30 - 12:30)",
                      "slotIndex": 2,
                      "courseCode": "MATH201",
                      "courseName": "Linear Algebra",
                      "group": "2CS2-Science",
                      "type": "Lect.",
                      "room": "Hall 3",
                      "instructor": "د. كمال النجار",
                      "bgColor": "#8B5CF6",
                      "colspan": 1,
                      "rawContent": "Linear Algebra (MATH201)\nGroup: 2CS2-Science\nLect.\nد. كمال النجار\nHall 3"
                    }
                  ]
                }
              ]
            },
            "2CS3": { "groupName": "2CS3", "groupValue": "2CS3", "hasTimetable": true, "schedule": [] },
            "2CS-DM": { "groupName": "2CS-DM", "groupValue": "2CS-DM", "hasTimetable": true, "schedule": [] }
          }
        },
        "3": {
          "periodName": "3",
          "periodValue": "3",
          "groups": {
            "3CS1": { "groupName": "3CS1", "groupValue": "3CS1", "hasTimetable": true, "schedule": [] },
            "3CS2": { "groupName": "3CS2", "groupValue": "3CS2", "hasTimetable": true, "schedule": [] },
            "3CS3": { "groupName": "3CS3", "groupValue": "3CS3", "hasTimetable": true, "schedule": [] },
            "3CS4": { "groupName": "3CS4", "groupValue": "3CS4", "hasTimetable": true, "schedule": [] },
            "3CS5": { "groupName": "3CS5", "groupValue": "3CS5", "hasTimetable": true, "schedule": [] },
            "3CS6": { "groupName": "3CS6", "groupValue": "3CS6", "hasTimetable": true, "schedule": [] },
            "3CS7": { "groupName": "3CS7", "groupValue": "3CS7", "hasTimetable": true, "schedule": [] },
            "3CS8": { "groupName": "3CS8", "groupValue": "3CS8", "hasTimetable": true, "schedule": [] },
            "3CS9": { "groupName": "3CS9", "groupValue": "3CS9", "hasTimetable": true, "schedule": [] },
            "3CS10": { "groupName": "3CS10", "groupValue": "3CS10", "hasTimetable": true, "schedule": [] },
            "3CS11": { "groupName": "3CS11", "groupValue": "3CS11", "hasTimetable": true, "schedule": [] },
            "3CS12": { "groupName": "3CS12", "groupValue": "3CS12", "hasTimetable": true, "schedule": [] },
            "3CS13": { "groupName": "3CS13", "groupValue": "3CS13", "hasTimetable": true, "schedule": [] },
            "3CS14": { "groupName": "3CS14", "groupValue": "3CS14", "hasTimetable": true, "schedule": [] },
            "3CS15": { "groupName": "3CS15", "groupValue": "3CS15", "hasTimetable": true, "schedule": [] },
            "3CS16": { "groupName": "3CS16", "groupValue": "3CS16", "hasTimetable": true, "schedule": [] },
            "3CS17": { "groupName": "3CS17", "groupValue": "3CS17", "hasTimetable": true, "schedule": [] }
          }
        },
        "4": { "periodName": "4", "periodValue": "4", "groups": {} },
        "5": { "periodName": "5", "periodValue": "5", "groups": {} },
        "6": { "periodName": "6", "periodValue": "6", "groups": {} },
        "7": { "periodName": "7", "periodValue": "7", "groups": {} },
        "8": { "periodName": "8", "periodValue": "8", "groups": {} }
      }
    },
    "علوم حاسب ق.م-Northampton": {
      "departmentName": "علوم حاسب ق.م-Northampton",
      "rawDepartmentLabel": "علوم حاسب ق.م-Northampton //",
      "departmentValue": "435,10",
      "totalSchedules": 8,
      "periods": {}
    },
    "نظم معلومات -ق م": {
      "departmentName": "نظم معلومات -ق م",
      "rawDepartmentLabel": "نظم معلومات -ق م",
      "departmentValue": "73,1",
      "totalSchedules": 19,
      "periods": {}
    },
    "هندسة البرمجيات - ق.م": {
      "departmentName": "هندسة البرمجيات - ق.م",
      "rawDepartmentLabel": "هندسة البرمجيات - ق.م",
      "departmentValue": "149,1",
      "totalSchedules": 29,
      "periods": {}
    },
    "هندسة برمجيات ق.م -Northampton": {
      "departmentName": "هندسة برمجيات ق.م -Northampton",
      "rawDepartmentLabel": "هندسة برمجيات ق.م -Northampton //",
      "departmentValue": "435,30",
      "totalSchedules": 8,
      "periods": {}
    }
  },
  "allSchedules": []
}
;

  return {
    DEFAULT_COURSE_SET,
    DEFAULT_MAJOR_SCHEDULE_JSON,
    DEFAULT_MAJOR_CATALOG
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SampleScheduleData;
}