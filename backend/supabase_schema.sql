-- ==============================================================================
-- STUDENT PERFORMANCE PREDICTION SYSTEM — DATABASE SCHEMA
-- Supabase PostgreSQL Table Definitions and Security Policies
-- ==============================================================================

-- 1. Table: student_predictions
-- Stores individual and batch academic performance predictions
CREATE TABLE IF NOT EXISTS public.student_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT,
    student_name TEXT,
    study_hours NUMERIC(4, 1),
    attendance NUMERIC(5, 2),
    previous_marks NUMERIC(5, 2),
    assignments NUMERIC(5, 2),
    internal_marks NUMERIC(5, 2),
    predicted_result TEXT NOT NULL,
    confidence_percentage NUMERIC(5, 2),
    risk_level TEXT,
    is_at_risk BOOLEAN DEFAULT false,
    contributing_factors TEXT[],
    teacher_recommendations TEXT[],
    model_used TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Table: at_risk_students
-- Early Warning System roster for monitoring vulnerable students and intervention plans
CREATE TABLE IF NOT EXISTS public.at_risk_students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT NOT NULL,
    student_name TEXT,
    attendance NUMERIC(5, 2),
    study_hours NUMERIC(4, 1),
    previous_marks NUMERIC(5, 2),
    internal_marks NUMERIC(5, 2),
    predicted_result TEXT,
    risk_severity TEXT,
    primary_vulnerabilities TEXT,
    intervention_status TEXT DEFAULT 'Pending Review',
    action_plan TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Table: academic_datasets
-- Tracks historical datasets uploaded and model benchmark accuracies
CREATE TABLE IF NOT EXISTS public.academic_datasets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dataset_name TEXT NOT NULL,
    total_records INTEGER,
    target_column TEXT,
    best_model TEXT,
    best_accuracy NUMERIC(5, 2),
    uploaded_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Allows read, insert, update and delete access for frontend and backend API keys
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.student_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.at_risk_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_datasets ENABLE ROW LEVEL SECURITY;

-- Allow public read & write access for student_predictions
DROP POLICY IF EXISTS "Allow public read on student_predictions" ON public.student_predictions;
CREATE POLICY "Allow public read on student_predictions"
    ON public.student_predictions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on student_predictions" ON public.student_predictions;
CREATE POLICY "Allow public insert on student_predictions"
    ON public.student_predictions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on student_predictions" ON public.student_predictions;
CREATE POLICY "Allow public update on student_predictions"
    ON public.student_predictions FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete on student_predictions" ON public.student_predictions;
CREATE POLICY "Allow public delete on student_predictions"
    ON public.student_predictions FOR DELETE USING (true);

-- Allow public read & write access for at_risk_students
DROP POLICY IF EXISTS "Allow public read on at_risk_students" ON public.at_risk_students;
CREATE POLICY "Allow public read on at_risk_students"
    ON public.at_risk_students FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on at_risk_students" ON public.at_risk_students;
CREATE POLICY "Allow public insert on at_risk_students"
    ON public.at_risk_students FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on at_risk_students" ON public.at_risk_students;
CREATE POLICY "Allow public update on at_risk_students"
    ON public.at_risk_students FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete on at_risk_students" ON public.at_risk_students;
CREATE POLICY "Allow public delete on at_risk_students"
    ON public.at_risk_students FOR DELETE USING (true);

-- Allow public read & write access for academic_datasets
DROP POLICY IF EXISTS "Allow public read on academic_datasets" ON public.academic_datasets;
CREATE POLICY "Allow public read on academic_datasets"
    ON public.academic_datasets FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on academic_datasets" ON public.academic_datasets;
CREATE POLICY "Allow public insert on academic_datasets"
    ON public.academic_datasets FOR INSERT WITH CHECK (true);
