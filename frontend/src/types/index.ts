export interface Department {
  id: string;
  name: string;
  head_doctor: string;
  contact_info: string;
}

export interface Patient {
  id: string;
  full_name: string;
  birth_date: string;
  gender: string;
  contact_info: string;
  ward_id: string;
  attending_doctor_id: string;
  registration_date: string;
  ward_number?: string;
  doctor_name?: string;
  disease: string;
}

export interface Employee {
  id: string;
  full_name: string;
  position: string;
  department_name: string;
  contact_info: string;
  education: string;
  specialization: string;
}

export interface Ward {
  id: string;
  number: string;
  department_name: string;
  bed_count: number;
}

export interface Disease {
  id: string;
  name: string;
  category_name: string;
  complexity_description: string;
}
