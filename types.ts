
export type Rating = 'happy' | 'neutral' | 'sad' | null;

export interface Grades {
  reading: string;
  writing: string;
  listening: string;
  speaking: string;
}

export interface Behaviors {
  participation: Rating;
  learningBehaviors: Rating;
  socialSkills: Rating;
  classWork: Rating;
}

export interface ReportData {
  studentName: string;
  teacherName: string;
  courseLevel: string;
  year: string;
  grades: Grades;
  behaviors: Behaviors;
  comments: string;
}
