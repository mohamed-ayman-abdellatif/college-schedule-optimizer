/**
 * sampleData.js
 * Pre-loaded sample courses including the exact Applied Programming - ECE2102
 * provided by the user, plus complementary university courses to demonstrate
 * instant clash-solving, doctor matching, and gap minimization.
 */

const SampleScheduleData = (() => {
  // Course 1: The user's exact schedule from HTML
  const APPLIED_PROGRAMMING = {
    id: 'ECE2102',
    name: 'Applied Programming',
    code: 'ECE2102',
    color: '#3B82F6',
    instructors: [
      'هشام صلاح الدين محمد رشاد',
      'دينا محمد علي ابو الدهب',
      'يارا اشرف كامل محمد',
      'مجد نبيل نصرى نعمه',
      'محمد حسام محمد علي',
      'احمد زكريا نور محمد طلحه'
    ],
    groups: [
      {
        group: 'B',
        instructors: ['هشام صلاح الدين محمد رشاد', 'مجد نبيل نصرى نعمه'],
        sessions: [
          { type: 'Lect.', day: 'Tuesday', startSlot: 3, endSlot: 4, duration: 2, instructor: 'هشام صلاح الدين محمد رشاد' },
          { type: 'Lab.', day: 'Sunday', startSlot: 7, endSlot: 8, duration: 2, instructor: 'مجد نبيل نصرى نعمه' }
        ]
      },
      {
        group: 'C',
        instructors: ['هشام صلاح الدين محمد رشاد', 'مجد نبيل نصرى نعمه'],
        sessions: [
          { type: 'Lect.', day: 'Tuesday', startSlot: 3, endSlot: 4, duration: 2, instructor: 'هشام صلاح الدين محمد رشاد' },
          { type: 'Lab.', day: 'Thursday', startSlot: 5, endSlot: 6, duration: 2, instructor: 'مجد نبيل نصرى نعمه' }
        ]
      },
      {
        group: 'D',
        instructors: ['هشام صلاح الدين محمد رشاد', 'مجد نبيل نصرى نعمه'],
        sessions: [
          { type: 'Lect.', day: 'Wednesday', startSlot: 3, endSlot: 4, duration: 2, instructor: 'هشام صلاح الدين محمد رشاد' },
          { type: 'Lab.', day: 'Wednesday', startSlot: 5, endSlot: 6, duration: 2, instructor: 'مجد نبيل نصرى نعمه' }
        ]
      },
      {
        group: 'E',
        instructors: ['هشام صلاح الدين محمد رشاد'],
        sessions: [
          { type: 'Lect.', day: 'Wednesday', startSlot: 3, endSlot: 4, duration: 2, instructor: 'هشام صلاح الدين محمد رشاد' },
          { type: 'Lab.', day: 'Saturday', startSlot: 1, endSlot: 2, duration: 2, instructor: 'Not Specified' }
        ]
      },
      {
        group: 'F',
        instructors: ['هشام صلاح الدين محمد رشاد', 'محمد حسام محمد علي'],
        sessions: [
          { type: 'Lect.', day: 'Tuesday', startSlot: 1, endSlot: 2, duration: 2, instructor: 'هشام صلاح الدين محمد رشاد' },
          { type: 'Lab.', day: 'Thursday', startSlot: 3, endSlot: 4, duration: 2, instructor: 'محمد حسام محمد علي' }
        ]
      },
      {
        group: 'G',
        instructors: ['هشام صلاح الدين محمد رشاد', 'محمد حسام محمد علي'],
        sessions: [
          { type: 'Lect.', day: 'Tuesday', startSlot: 1, endSlot: 2, duration: 2, instructor: 'هشام صلاح الدين محمد رشاد' },
          { type: 'Lab.', day: 'Thursday', startSlot: 1, endSlot: 2, duration: 2, instructor: 'محمد حسام محمد علي' }
        ]
      },
      {
        group: 'H',
        instructors: ['دينا محمد علي ابو الدهب', 'احمد زكريا نور محمد طلحه'],
        sessions: [
          { type: 'Lect.', day: 'Tuesday', startSlot: 5, endSlot: 6, duration: 2, instructor: 'دينا محمد علي ابو الدهب' },
          { type: 'Lab.', day: 'Wednesday', startSlot: 1, endSlot: 2, duration: 2, instructor: 'احمد زكريا نور محمد طلحه' }
        ]
      },
      {
        group: 'I',
        instructors: ['دينا محمد علي ابو الدهب', 'احمد زكريا نور محمد طلحه'],
        sessions: [
          { type: 'Lect.', day: 'Tuesday', startSlot: 5, endSlot: 6, duration: 2, instructor: 'دينا محمد علي ابو الدهب' },
          { type: 'Lab.', day: 'Monday', startSlot: 5, endSlot: 6, duration: 2, instructor: 'احمد زكريا نور محمد طلحه' }
        ]
      },
      {
        group: 'J',
        instructors: ['يارا اشرف كامل محمد', 'محمد حسام محمد علي'],
        sessions: [
          { type: 'Lect.', day: 'Wednesday', startSlot: 7, endSlot: 8, duration: 2, instructor: 'يارا اشرف كامل محمد' },
          { type: 'Lab.', day: 'Thursday', startSlot: 7, endSlot: 8, duration: 2, instructor: 'محمد حسام محمد علي' }
        ]
      },
      {
        group: 'K',
        instructors: ['يارا اشرف كامل محمد'],
        sessions: [
          { type: 'Lect.', day: 'Wednesday', startSlot: 7, endSlot: 8, duration: 2, instructor: 'يارا اشرف كامل محمد' },
          { type: 'Lab.', day: 'Wednesday', startSlot: 11, endSlot: 12, duration: 2, instructor: 'Not Specified' }
        ]
      },
      {
        group: 'L',
        instructors: [],
        sessions: [
          { type: 'Lect.', day: 'Thursday', startSlot: 7, endSlot: 8, duration: 2, instructor: 'Not Specified' },
          { type: 'Lab.', day: 'Sunday', startSlot: 11, endSlot: 12, duration: 2, instructor: 'Not Specified' }
        ]
      }
    ]
  };

  // Course 2: Differential Equations - EBA2201
  const DIFFERENTIAL_EQUATIONS = {
    id: 'EBA2201',
    name: 'Differential Equations',
    code: 'EBA2201',
    color: '#10B981',
    instructors: [
      'د. محمود عبد الحميد رضوان',
      'د. اميرة عبد المنعم النجار',
      'م. كريم سامي توفيق'
    ],
    groups: [
      {
        group: 'B',
        instructors: ['د. محمود عبد الحميد رضوان', 'م. كريم سامي توفيق'],
        sessions: [
          { type: 'Lect.', day: 'Sunday', startSlot: 3, endSlot: 4, duration: 2, instructor: 'د. محمود عبد الحميد رضوان' },
          { type: 'Sec.', day: 'Tuesday', startSlot: 5, endSlot: 6, duration: 2, instructor: 'م. كريم سامي توفيق' }
        ]
      },
      {
        group: 'C',
        instructors: ['د. محمود عبد الحميد رضوان', 'م. كريم سامي توفيق'],
        sessions: [
          { type: 'Lect.', day: 'Sunday', startSlot: 3, endSlot: 4, duration: 2, instructor: 'د. محمود عبد الحميد رضوان' },
          { type: 'Sec.', day: 'Thursday', startSlot: 3, endSlot: 4, duration: 2, instructor: 'م. كريم سامي توفيق' }
        ]
      },
      {
        group: 'D',
        instructors: ['د. اميرة عبد المنعم النجار'],
        sessions: [
          { type: 'Lect.', day: 'Monday', startSlot: 1, endSlot: 2, duration: 2, instructor: 'د. اميرة عبد المنعم النجار' },
          { type: 'Sec.', day: 'Wednesday', startSlot: 3, endSlot: 4, duration: 2, instructor: 'م. كريم سامي توفيق' }
        ]
      },
      {
        group: 'F',
        instructors: ['د. اميرة عبد المنعم النجار'],
        sessions: [
          { type: 'Lect.', day: 'Monday', startSlot: 1, endSlot: 2, duration: 2, instructor: 'د. اميرة عبد المنعم النجار' },
          { type: 'Sec.', day: 'Tuesday', startSlot: 3, endSlot: 4, duration: 2, instructor: 'م. كريم سامي توفيق' }
        ]
      },
      {
        group: 'G',
        instructors: ['د. محمود عبد الحميد رضوان'],
        sessions: [
          { type: 'Lect.', day: 'Sunday', startSlot: 1, endSlot: 2, duration: 2, instructor: 'د. محمود عبد الحميد رضوان' },
          { type: 'Sec.', day: 'Thursday', startSlot: 3, endSlot: 4, duration: 2, instructor: 'م. كريم سامي توفيق' }
        ]
      }
    ]
  };

  // Course 3: Digital Logic Design - ECE2201
  const DIGITAL_LOGIC = {
    id: 'ECE2201',
    name: 'Digital Logic Design',
    code: 'ECE2201',
    color: '#8B5CF6',
    instructors: [
      'د. شريف عبد العظيم فايد',
      'د. هالة مصطفى زايد',
      'م. نورهان خالد ابراهيم'
    ],
    groups: [
      {
        group: 'B',
        instructors: ['د. شريف عبد العظيم فايد', 'م. نورهان خالد ابراهيم'],
        sessions: [
          { type: 'Lect.', day: 'Sunday', startSlot: 5, endSlot: 6, duration: 2, instructor: 'د. شريف عبد العظيم فايد' },
          { type: 'Lab.', day: 'Tuesday', startSlot: 1, endSlot: 2, duration: 2, instructor: 'م. نورهان خالد ابراهيم' }
        ]
      },
      {
        group: 'C',
        instructors: ['د. شريف عبد العظيم فايد', 'م. نورهان خالد ابراهيم'],
        sessions: [
          { type: 'Lect.', day: 'Sunday', startSlot: 5, endSlot: 6, duration: 2, instructor: 'د. شريف عبد العظيم فايد' },
          { type: 'Lab.', day: 'Thursday', startSlot: 1, endSlot: 2, duration: 2, instructor: 'م. نورهان خالد ابراهيم' }
        ]
      },
      {
        group: 'D',
        instructors: ['د. هالة مصطفى زايد'],
        sessions: [
          { type: 'Lect.', day: 'Wednesday', startSlot: 1, endSlot: 2, duration: 2, instructor: 'د. هالة مصطفى زايد' },
          { type: 'Lab.', day: 'Monday', startSlot: 3, endSlot: 4, duration: 2, instructor: 'م. نورهان خالد ابراهيم' }
        ]
      },
      {
        group: 'F',
        instructors: ['د. هالة مصطفى زايد'],
        sessions: [
          { type: 'Lect.', day: 'Wednesday', startSlot: 1, endSlot: 2, duration: 2, instructor: 'د. هالة مصطفى زايد' },
          { type: 'Lab.', day: 'Thursday', startSlot: 5, endSlot: 6, duration: 2, instructor: 'م. نورهان خالد ابراهيم' }
        ]
      },
      {
        group: 'G',
        instructors: ['د. شريف عبد العظيم فايد'],
        sessions: [
          { type: 'Lect.', day: 'Sunday', startSlot: 3, endSlot: 4, duration: 2, instructor: 'د. شريف عبد العظيم فايد' },
          { type: 'Lab.', day: 'Tuesday', startSlot: 7, endSlot: 8, duration: 2, instructor: 'م. نورهان خالد ابراهيم' }
        ]
      }
    ]
  };

  // Course 4: Electrical Circuits I - EEE2304
  const ELECTRICAL_CIRCUITS = {
    id: 'EEE2304',
    name: 'Electrical Circuits I',
    code: 'EEE2304',
    color: '#F59E0B',
    instructors: [
      'د. حسام الدين مصطفى سليم',
      'د. ريهام طارق خيري',
      'م. عمر اشرف جودة'
    ],
    groups: [
      {
        group: 'B',
        instructors: ['د. حسام الدين مصطفى سليم', 'م. عمر اشرف جودة'],
        sessions: [
          { type: 'Lect.', day: 'Monday', startSlot: 3, endSlot: 4, duration: 2, instructor: 'د. حسام الدين مصطفى سليم' },
          { type: 'Lab.', day: 'Wednesday', startSlot: 5, endSlot: 6, duration: 2, instructor: 'م. عمر اشرف جودة' }
        ]
      },
      {
        group: 'C',
        instructors: ['د. حسام الدين مصطفى سليم', 'م. عمر اشرف جودة'],
        sessions: [
          { type: 'Lect.', day: 'Monday', startSlot: 3, endSlot: 4, duration: 2, instructor: 'د. حسام الدين مصطفى سليم' },
          { type: 'Lab.', day: 'Thursday', startSlot: 7, endSlot: 8, duration: 2, instructor: 'م. عمر اشرف جودة' }
        ]
      },
      {
        group: 'D',
        instructors: ['د. ريهام طارق خيري'],
        sessions: [
          { type: 'Lect.', day: 'Sunday', startSlot: 1, endSlot: 2, duration: 2, instructor: 'د. ريهام طارق خيري' },
          { type: 'Lab.', day: 'Tuesday', startSlot: 7, endSlot: 8, duration: 2, instructor: 'م. عمر اشرف جودة' }
        ]
      },
      {
        group: 'F',
        instructors: ['د. ريهام طارق خيري'],
        sessions: [
          { type: 'Lect.', day: 'Sunday', startSlot: 1, endSlot: 2, duration: 2, instructor: 'د. ريهام طارق خيري' },
          { type: 'Lab.', day: 'Wednesday', startSlot: 3, endSlot: 4, duration: 2, instructor: 'م. عمر اشرف جودة' }
        ]
      }
    ]
  };

  // Course 5: Engineering Economy - UNR2303
  const ENGINEERING_ECONOMY = {
    id: 'UNR2303',
    name: 'Engineering Economy',
    code: 'UNR2303',
    color: '#EC4899',
    instructors: [
      'د. وليد فاروق النحاس',
      'د. نجلاء عبد الغني مرسي'
    ],
    groups: [
      {
        group: 'B',
        instructors: ['د. وليد فاروق النحاس'],
        sessions: [
          { type: 'Lect.', day: 'Tuesday', startSlot: 1, endSlot: 2, duration: 2, instructor: 'د. وليد فاروق النحاس' },
          { type: 'Sec.', day: 'Tuesday', startSlot: 7, endSlot: 8, duration: 2, instructor: 'مساعد تدريس' }
        ]
      },
      {
        group: 'C',
        instructors: ['د. وليد فاروق النحاس'],
        sessions: [
          { type: 'Lect.', day: 'Tuesday', startSlot: 1, endSlot: 2, duration: 2, instructor: 'د. وليد فاروق النحاس' },
          { type: 'Sec.', day: 'Thursday', startSlot: 5, endSlot: 6, duration: 2, instructor: 'مساعد تدريس' }
        ]
      },
      {
        group: 'D',
        instructors: ['د. نجلاء عبد الغني مرسي'],
        sessions: [
          { type: 'Lect.', day: 'Monday', startSlot: 5, endSlot: 6, duration: 2, instructor: 'د. نجلاء عبد الغني مرسي' },
          { type: 'Sec.', day: 'Wednesday', startSlot: 1, endSlot: 2, duration: 2, instructor: 'مساعد تدريس' }
        ]
      },
      {
        group: 'F',
        instructors: ['د. نجلاء عبد الغني مرسي'],
        sessions: [
          { type: 'Lect.', day: 'Monday', startSlot: 5, endSlot: 6, duration: 2, instructor: 'د. نجلاء عبد الغني مرسي' },
          { type: 'Sec.', day: 'Thursday', startSlot: 1, endSlot: 2, duration: 2, instructor: 'مساعد تدريس' }
        ]
      }
    ]
  };

  // Pre-load default course set
  const DEFAULT_COURSE_SET = [
    APPLIED_PROGRAMMING,
    DIFFERENTIAL_EQUATIONS,
    DIGITAL_LOGIC,
    ELECTRICAL_CIRCUITS,
    ENGINEERING_ECONOMY
  ];

  return {
    APPLIED_PROGRAMMING,
    DIFFERENTIAL_EQUATIONS,
    DIGITAL_LOGIC,
    ELECTRICAL_CIRCUITS,
    ENGINEERING_ECONOMY,
    DEFAULT_COURSE_SET
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SampleScheduleData;
}
