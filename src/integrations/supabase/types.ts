export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string
          description: string | null
          device_info: string | null
          id: string
          ip_address: string | null
          metadata: Json | null
          module: string
          user_id: string | null
          user_name: string
          user_role: string
        }
        Insert: {
          action: string
          created_at?: string
          description?: string | null
          device_info?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          module?: string
          user_id?: string | null
          user_name?: string
          user_role?: string
        }
        Update: {
          action?: string
          created_at?: string
          description?: string | null
          device_info?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          module?: string
          user_id?: string | null
          user_name?: string
          user_role?: string
        }
        Relationships: []
      }
      announcements: {
        Row: {
          attachment_url: string | null
          created_at: string
          id: string
          is_active: boolean | null
          message: string
          posted_by: string | null
          priority: string | null
          target_audience: string | null
          title: string
        }
        Insert: {
          attachment_url?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          message: string
          posted_by?: string | null
          priority?: string | null
          target_audience?: string | null
          title: string
        }
        Update: {
          attachment_url?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          message?: string
          posted_by?: string | null
          priority?: string | null
          target_audience?: string | null
          title?: string
        }
        Relationships: []
      }
      attendance: {
        Row: {
          check_in: string | null
          check_out: string | null
          class_id: string | null
          created_at: string
          date: string
          id: string
          marked_by: string | null
          remarks: string | null
          status: string
          student_id: string | null
          teacher_id: string | null
        }
        Insert: {
          check_in?: string | null
          check_out?: string | null
          class_id?: string | null
          created_at?: string
          date?: string
          id?: string
          marked_by?: string | null
          remarks?: string | null
          status: string
          student_id?: string | null
          teacher_id?: string | null
        }
        Update: {
          check_in?: string | null
          check_out?: string | null
          class_id?: string | null
          created_at?: string
          date?: string
          id?: string
          marked_by?: string | null
          remarks?: string | null
          status?: string
          student_id?: string | null
          teacher_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      cafeteria_menu: {
        Row: {
          calories: number | null
          created_at: string
          day_of_week: number
          description: string | null
          food_name: string
          id: string
          image_url: string | null
          ingredients: string | null
          is_available: boolean | null
          is_vegetarian: boolean | null
          meal_category: string
        }
        Insert: {
          calories?: number | null
          created_at?: string
          day_of_week: number
          description?: string | null
          food_name: string
          id?: string
          image_url?: string | null
          ingredients?: string | null
          is_available?: boolean | null
          is_vegetarian?: boolean | null
          meal_category?: string
        }
        Update: {
          calories?: number | null
          created_at?: string
          day_of_week?: number
          description?: string | null
          food_name?: string
          id?: string
          image_url?: string | null
          ingredients?: string | null
          is_available?: boolean | null
          is_vegetarian?: boolean | null
          meal_category?: string
        }
        Relationships: []
      }
      classes: {
        Row: {
          academic_year: string
          capacity: number | null
          created_at: string
          grade_level: number | null
          id: string
          name: string
          section: string | null
        }
        Insert: {
          academic_year?: string
          capacity?: number | null
          created_at?: string
          grade_level?: number | null
          id?: string
          name: string
          section?: string | null
        }
        Update: {
          academic_year?: string
          capacity?: number | null
          created_at?: string
          grade_level?: number | null
          id?: string
          name?: string
          section?: string | null
        }
        Relationships: []
      }
      exam_schedules: {
        Row: {
          end_time: string | null
          exam_date: string
          exam_id: string
          id: string
          max_marks: number | null
          room: string | null
          start_time: string | null
          subject_id: string
        }
        Insert: {
          end_time?: string | null
          exam_date: string
          exam_id: string
          id?: string
          max_marks?: number | null
          room?: string | null
          start_time?: string | null
          subject_id: string
        }
        Update: {
          end_time?: string | null
          exam_date?: string
          exam_id?: string
          id?: string
          max_marks?: number | null
          room?: string | null
          start_time?: string | null
          subject_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exam_schedules_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_schedules_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      exams: {
        Row: {
          academic_year: string | null
          class_id: string | null
          created_at: string
          end_date: string | null
          exam_type: string | null
          id: string
          name: string
          start_date: string | null
          status: string | null
        }
        Insert: {
          academic_year?: string | null
          class_id?: string | null
          created_at?: string
          end_date?: string | null
          exam_type?: string | null
          id?: string
          name: string
          start_date?: string | null
          status?: string | null
        }
        Update: {
          academic_year?: string | null
          class_id?: string | null
          created_at?: string
          end_date?: string | null
          exam_type?: string | null
          id?: string
          name?: string
          start_date?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exams_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_payments: {
        Row: {
          amount_paid: number
          created_at: string
          fee_structure_id: string
          id: string
          payment_date: string | null
          payment_method: string | null
          receipt_number: string | null
          status: string | null
          student_id: string
        }
        Insert: {
          amount_paid: number
          created_at?: string
          fee_structure_id: string
          id?: string
          payment_date?: string | null
          payment_method?: string | null
          receipt_number?: string | null
          status?: string | null
          student_id: string
        }
        Update: {
          amount_paid?: number
          created_at?: string
          fee_structure_id?: string
          id?: string
          payment_date?: string | null
          payment_method?: string | null
          receipt_number?: string | null
          status?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fee_payments_fee_structure_id_fkey"
            columns: ["fee_structure_id"]
            isOneToOne: false
            referencedRelation: "fee_structure"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fee_payments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      fee_structure: {
        Row: {
          academic_year: string | null
          amount: number
          class_id: string | null
          created_at: string
          due_date: string | null
          fee_type: string | null
          id: string
          name: string
        }
        Insert: {
          academic_year?: string | null
          amount: number
          class_id?: string | null
          created_at?: string
          due_date?: string | null
          fee_type?: string | null
          id?: string
          name: string
        }
        Update: {
          academic_year?: string | null
          amount?: number
          class_id?: string | null
          created_at?: string
          due_date?: string | null
          fee_type?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "fee_structure_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      homework: {
        Row: {
          attachment_url: string | null
          class_id: string
          created_at: string
          description: string | null
          due_date: string
          id: string
          status: string | null
          subject_id: string
          teacher_id: string
          title: string
        }
        Insert: {
          attachment_url?: string | null
          class_id: string
          created_at?: string
          description?: string | null
          due_date: string
          id?: string
          status?: string | null
          subject_id: string
          teacher_id: string
          title: string
        }
        Update: {
          attachment_url?: string | null
          class_id?: string
          created_at?: string
          description?: string | null
          due_date?: string
          id?: string
          status?: string | null
          subject_id?: string
          teacher_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "homework_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "homework_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "homework_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      homework_submissions: {
        Row: {
          attachment_url: string | null
          feedback: string | null
          grade: string | null
          homework_id: string
          id: string
          student_id: string
          submission_text: string | null
          submitted_at: string | null
        }
        Insert: {
          attachment_url?: string | null
          feedback?: string | null
          grade?: string | null
          homework_id: string
          id?: string
          student_id: string
          submission_text?: string | null
          submitted_at?: string | null
        }
        Update: {
          attachment_url?: string | null
          feedback?: string | null
          grade?: string | null
          homework_id?: string
          id?: string
          student_id?: string
          submission_text?: string | null
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "homework_submissions_homework_id_fkey"
            columns: ["homework_id"]
            isOneToOne: false
            referencedRelation: "homework"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "homework_submissions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      hostel_allocations: {
        Row: {
          allocated_date: string | null
          bed_number: number | null
          created_at: string
          id: string
          room_id: string
          status: string | null
          student_id: string
        }
        Insert: {
          allocated_date?: string | null
          bed_number?: number | null
          created_at?: string
          id?: string
          room_id: string
          status?: string | null
          student_id: string
        }
        Update: {
          allocated_date?: string | null
          bed_number?: number | null
          created_at?: string
          id?: string
          room_id?: string
          status?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hostel_allocations_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "hostel_rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hostel_allocations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      hostel_buildings: {
        Row: {
          created_at: string
          id: string
          name: string
          status: string | null
          total_floors: number | null
          type: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          status?: string | null
          total_floors?: number | null
          type?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          status?: string | null
          total_floors?: number | null
          type?: string | null
        }
        Relationships: []
      }
      hostel_rooms: {
        Row: {
          building_id: string
          created_at: string
          floor: number
          id: string
          room_number: string
          status: string | null
          total_beds: number
        }
        Insert: {
          building_id: string
          created_at?: string
          floor?: number
          id?: string
          room_number: string
          status?: string | null
          total_beds?: number
        }
        Update: {
          building_id?: string
          created_at?: string
          floor?: number
          id?: string
          room_number?: string
          status?: string | null
          total_beds?: number
        }
        Relationships: [
          {
            foreignKeyName: "hostel_rooms_building_id_fkey"
            columns: ["building_id"]
            isOneToOne: false
            referencedRelation: "hostel_buildings"
            referencedColumns: ["id"]
          },
        ]
      }
      marks: {
        Row: {
          created_at: string
          entered_by: string | null
          exam_id: string
          grade: string | null
          id: string
          marks_obtained: number | null
          max_marks: number | null
          remarks: string | null
          student_id: string
          subject_id: string
        }
        Insert: {
          created_at?: string
          entered_by?: string | null
          exam_id: string
          grade?: string | null
          id?: string
          marks_obtained?: number | null
          max_marks?: number | null
          remarks?: string | null
          student_id: string
          subject_id: string
        }
        Update: {
          created_at?: string
          entered_by?: string | null
          exam_id?: string
          grade?: string | null
          id?: string
          marks_obtained?: number | null
          max_marks?: number | null
          remarks?: string | null
          student_id?: string
          subject_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marks_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marks_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marks_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      meetings: {
        Row: {
          created_at: string
          description: string | null
          end_time: string | null
          id: string
          meeting_date: string
          meeting_link: string | null
          scheduled_by: string | null
          scheduled_with: string | null
          start_time: string | null
          status: string | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_time?: string | null
          id?: string
          meeting_date: string
          meeting_link?: string | null
          scheduled_by?: string | null
          scheduled_with?: string | null
          start_time?: string | null
          status?: string | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_time?: string | null
          id?: string
          meeting_date?: string
          meeting_link?: string | null
          scheduled_by?: string | null
          scheduled_with?: string | null
          start_time?: string | null
          status?: string | null
          title?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean | null
          receiver_id: string
          sender_id: string
          subject: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          receiver_id: string
          sender_id: string
          subject?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          receiver_id?: string
          sender_id?: string
          subject?: string | null
        }
        Relationships: []
      }
      parent_students: {
        Row: {
          id: string
          parent_id: string
          student_id: string
        }
        Insert: {
          id?: string
          parent_id: string
          student_id: string
        }
        Update: {
          id?: string
          parent_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "parent_students_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "parents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parent_students_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      parents: {
        Row: {
          created_at: string
          id: string
          occupation: string | null
          profile_id: string
          relationship: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          occupation?: string | null
          profile_id: string
          relationship?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          occupation?: string | null
          profile_id?: string
          relationship?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parents_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          created_at: string
          date_of_birth: string | null
          email: string
          full_name: string
          gender: string | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          email: string
          full_name: string
          gender?: string | null
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string
          full_name?: string
          gender?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          can_create: boolean | null
          can_delete: boolean | null
          can_edit: boolean | null
          can_view: boolean | null
          id: string
          module: string
          role: string
          updated_at: string
        }
        Insert: {
          can_create?: boolean | null
          can_delete?: boolean | null
          can_edit?: boolean | null
          can_view?: boolean | null
          id?: string
          module: string
          role: string
          updated_at?: string
        }
        Update: {
          can_create?: boolean | null
          can_delete?: boolean | null
          can_edit?: boolean | null
          can_view?: boolean | null
          id?: string
          module?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      student_transport: {
        Row: {
          id: string
          route_id: string
          stop_id: string | null
          student_id: string
        }
        Insert: {
          id?: string
          route_id: string
          stop_id?: string | null
          student_id: string
        }
        Update: {
          id?: string
          route_id?: string
          stop_id?: string | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_transport_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "transport_routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_transport_stop_id_fkey"
            columns: ["stop_id"]
            isOneToOne: false
            referencedRelation: "transport_stops"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_transport_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          admission_date: string | null
          admission_number: string | null
          blood_group: string | null
          class_id: string | null
          created_at: string
          id: string
          profile_id: string
          roll_number: number | null
          status: string | null
        }
        Insert: {
          admission_date?: string | null
          admission_number?: string | null
          blood_group?: string | null
          class_id?: string | null
          created_at?: string
          id?: string
          profile_id: string
          roll_number?: number | null
          status?: string | null
        }
        Update: {
          admission_date?: string | null
          admission_number?: string | null
          blood_group?: string | null
          class_id?: string | null
          created_at?: string
          id?: string
          profile_id?: string
          roll_number?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      study_materials: {
        Row: {
          class_id: string | null
          created_at: string
          description: string | null
          file_url: string | null
          id: string
          material_type: string | null
          subject_id: string | null
          teacher_id: string | null
          title: string
        }
        Insert: {
          class_id?: string | null
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          material_type?: string | null
          subject_id?: string | null
          teacher_id?: string | null
          title: string
        }
        Update: {
          class_id?: string | null
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          material_type?: string | null
          subject_id?: string | null
          teacher_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_materials_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "study_materials_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "study_materials_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          code: string | null
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      teacher_assignments: {
        Row: {
          academic_year: string
          class_id: string
          id: string
          subject_id: string
          teacher_id: string
        }
        Insert: {
          academic_year?: string
          class_id: string
          id?: string
          subject_id: string
          teacher_id: string
        }
        Update: {
          academic_year?: string
          class_id?: string
          id?: string
          subject_id?: string
          teacher_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teacher_assignments_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_assignments_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teacher_assignments_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      teachers: {
        Row: {
          created_at: string
          department: string | null
          employee_id: string | null
          experience_years: number | null
          id: string
          join_date: string | null
          profile_id: string
          qualification: string | null
          salary: number | null
          status: string | null
        }
        Insert: {
          created_at?: string
          department?: string | null
          employee_id?: string | null
          experience_years?: number | null
          id?: string
          join_date?: string | null
          profile_id: string
          qualification?: string | null
          salary?: number | null
          status?: string | null
        }
        Update: {
          created_at?: string
          department?: string | null
          employee_id?: string | null
          experience_years?: number | null
          id?: string
          join_date?: string | null
          profile_id?: string
          qualification?: string | null
          salary?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "teachers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      timetable: {
        Row: {
          class_id: string
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          room: string | null
          start_time: string
          subject_id: string
          teacher_id: string | null
        }
        Insert: {
          class_id: string
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          room?: string | null
          start_time: string
          subject_id: string
          teacher_id?: string | null
        }
        Update: {
          class_id?: string
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          room?: string | null
          start_time?: string
          subject_id?: string
          teacher_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "timetable_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timetable_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "timetable_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      transport_routes: {
        Row: {
          bus_number: string | null
          capacity: number | null
          created_at: string
          driver_name: string | null
          driver_phone: string | null
          id: string
          route_name: string
          status: string | null
        }
        Insert: {
          bus_number?: string | null
          capacity?: number | null
          created_at?: string
          driver_name?: string | null
          driver_phone?: string | null
          id?: string
          route_name: string
          status?: string | null
        }
        Update: {
          bus_number?: string | null
          capacity?: number | null
          created_at?: string
          driver_name?: string | null
          driver_phone?: string | null
          id?: string
          route_name?: string
          status?: string | null
        }
        Relationships: []
      }
      transport_stops: {
        Row: {
          drop_time: string | null
          id: string
          pickup_time: string | null
          route_id: string
          stop_name: string
          stop_order: number | null
        }
        Insert: {
          drop_time?: string | null
          id?: string
          pickup_time?: string | null
          route_id: string
          stop_name: string
          stop_order?: number | null
        }
        Update: {
          drop_time?: string | null
          id?: string
          pickup_time?: string | null
          route_id?: string
          stop_name?: string
          stop_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "transport_stops_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "transport_routes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "teacher" | "student" | "parent"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "teacher", "student", "parent"],
    },
  },
} as const
