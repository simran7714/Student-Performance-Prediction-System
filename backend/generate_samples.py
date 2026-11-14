import numpy as np
import pandas as pd
import random
import os

np.random.seed(42)
random.seed(42)

first_names = [
    "Aarav", "Aditi", "Rohan", "Ananya", "Rahul", "Priya", "Vikram", "Sneha",
    "Karthik", "Pooja", "Arjun", "Divya", "Siddharth", "Neha", "Varun", "Kavya",
    "Aditya", "Ishita", "Manish", "Tanvi", "Nikhil", "Shreya", "Gaurav", "Meera",
    "Harsh", "Deepika", "Pranav", "Riya", "Akash", "Swati", "Sanjay", "Anjali",
    "Sameer", "Preeti", "Kunal", "Bhavna", "Abhishek", "Sakshi", "Vivek", "Rashmi"
]

last_names = [
    "Sharma", "Verma", "Patel", "Mehta", "Iyer", "Nair", "Reddy", "Rao",
    "Singh", "Kumar", "Gupta", "Joshi", "Deshmukh", "Kulkarni", "Bhat", "Chopra",
    "Malhotra", "Kapoor", "Saxena", "Choudhury", "Bose", "Ghosh", "Das", "Menon"
]

def generate_student_data(n_samples=600):
    data = []
    for i in range(1, n_samples + 1):
        std_id = f"STU2024{i:04d}"
        fname = random.choice(first_names)
        lname = random.choice(last_names)
        gender = random.choice(["Male", "Female"])
        
        # Latent academic capability factor (Gaussian centered at 0)
        ability = np.random.normal(0, 1.0)
        
        # Study hours per day (range ~ 0.5 to 10.0 hours)
        study_hours = np.clip(np.random.normal(3.8 + 1.3 * ability, 1.4), 0.5, 10.0)
        
        # Attendance percentage (range ~ 35% to 100%)
        attendance = np.clip(np.random.normal(72 + 12.0 * ability, 12.0), 35.0, 99.5)
        
        # Previous Exam Marks (out of 100)
        previous_marks = np.clip(np.random.normal(60 + 15.0 * ability + 0.2 * (attendance - 70), 12.0), 20.0, 98.0)
        
        # Assignment Marks (out of 25)
        assignments = np.clip(np.random.normal(15.5 + 3.5 * ability + 0.6 * (study_hours - 3.5), 3.5), 3.0, 25.0)
        
        # Internal Assessment Marks (out of 25)
        internal_marks = np.clip(np.random.normal(15.0 + 3.8 * ability + 0.05 * (attendance - 70), 3.6), 3.0, 25.0)
        
        # Composite academic score out of 100
        composite = (
            0.35 * previous_marks +
            0.75 * (internal_marks * 4.0) * 0.25 +
            0.75 * (assignments * 4.0) * 0.20 +
            0.12 * attendance +
            0.08 * (study_hours * 10) +
            np.random.normal(0, 3.0)
        )
        composite = np.clip(composite, 18.0, 99.0)
        
        # Balanced Pass / Fail threshold: ~22% Fail rate for realistic academic classification
        if composite < 50.0 or attendance < 58.0 or (previous_marks < 40 and internal_marks < 10):
            is_pass = "Fail"
        else:
            is_pass = "Pass"
            
        # Grade (A, B, C, D, F)
        if is_pass == "Fail":
            grade = "F"
        elif composite >= 80:
            grade = "A"
        elif composite >= 68:
            grade = "B"
        elif composite >= 56:
            grade = "C"
        else:
            grade = "D"
            
        # Academic Category (High, Medium, Low)
        if grade in ["A", "B"]:
            perf_cat = "High"
        elif grade in ["C", "D"]:
            perf_cat = "Medium"
        else:
            perf_cat = "Low"
            
        data.append({
            "Student_ID": std_id,
            "Name": f"{fname} {lname}",
            "Gender": gender,
            "Study_Hours": round(float(study_hours), 1),
            "Attendance": round(float(attendance), 1),
            "Previous_Marks": round(float(previous_marks), 1),
            "Assignments": round(float(assignments), 1),
            "Internal_Marks": round(float(internal_marks), 1),
            "Final_Score": round(float(composite), 1),
            "Final_Result": is_pass,
            "Grade": grade,
            "Performance_Category": perf_cat
        })
        
    return pd.DataFrame(data)

def main():
    target_dir = os.path.join(os.path.dirname(__file__), "sample_data")
    os.makedirs(target_dir, exist_ok=True)
    
    df = generate_student_data(600)
    
    # 1. Binary Dataset (Pass/Fail)
    df_binary = df[["Student_ID", "Name", "Gender", "Study_Hours", "Attendance", "Previous_Marks", "Assignments", "Internal_Marks", "Final_Result"]]
    path_binary = os.path.join(target_dir, "student_performance_pass_fail.csv")
    df_binary.to_csv(path_binary, index=False)
    print(f"Generated {path_binary} with {len(df_binary)} rows.")
    print("Pass/Fail distribution:\n", df_binary["Final_Result"].value_counts())
    
    # 2. Multi-class Dataset (Grades A/B/C/D/F)
    df_grades = df[["Student_ID", "Name", "Gender", "Study_Hours", "Attendance", "Previous_Marks", "Assignments", "Internal_Marks", "Grade"]].rename(columns={"Grade": "Final_Result"})
    path_grades = os.path.join(target_dir, "student_performance_grades.csv")
    df_grades.to_csv(path_grades, index=False)
    print(f"\nGenerated {path_grades} with {len(df_grades)} rows.")
    print("Grade distribution:\n", df_grades["Final_Result"].value_counts())
    
    # 3. Multi-class Dataset (High/Medium/Low)
    df_cat = df[["Student_ID", "Name", "Gender", "Study_Hours", "Attendance", "Previous_Marks", "Assignments", "Internal_Marks", "Performance_Category"]].rename(columns={"Performance_Category": "Final_Result"})
    path_cat = os.path.join(target_dir, "student_performance_categories.csv")
    df_cat.to_csv(path_cat, index=False)
    print(f"\nGenerated {path_cat} with {len(df_cat)} rows.")
    print("Category distribution:\n", df_cat["Final_Result"].value_counts())
    
    # 4. Unlabeled Batch Test Dataset (60 students without Final_Result)
    df_unlabeled = df.iloc[520:580][["Student_ID", "Name", "Gender", "Study_Hours", "Attendance", "Previous_Marks", "Assignments", "Internal_Marks"]].copy()
    path_unlabeled = os.path.join(target_dir, "unlabeled_students_batch.csv")
    df_unlabeled.to_csv(path_unlabeled, index=False)
    print(f"\nGenerated {path_unlabeled} with {len(df_unlabeled)} rows for batch prediction testing.")

if __name__ == "__main__":
    main()
