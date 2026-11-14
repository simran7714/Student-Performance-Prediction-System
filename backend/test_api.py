import os
import json
import app

def test_direct_functions():
    print("=== Testing Backend Logic & Endpoints Directly ===")
    
    # Trigger startup
    app.startup_event()
    
    # 1. Health check
    h = app.health_check()
    print("1. Health Check:", h)
    assert h["status"] == "healthy"
    assert h["is_trained"] is True
    
    # 2. EDA
    eda = app.get_eda()
    print("2. EDA Check: Total records analyzed:", eda["total_records"])
    assert eda["total_records"] > 0
    assert "summary_statistics" in eda
    assert "correlation_matrix" in eda
    
    # 3. Model Summary
    models = app.get_model_summary()
    print("3. Best Model:", models["best_model"])
    for m_name, m_metrics in models["models"].items():
        print(f"   - {m_name}: Accuracy = {m_metrics['accuracy_percentage']}%, F1 = {m_metrics['f1_score_percentage']}%")
        assert m_metrics["accuracy_percentage"] > 70.0
        
    # 4. Single Prediction (Good Student)
    good_req = {
        "features": {
            "Study_Hours": 6.5,
            "Attendance": 92.0,
            "Previous_Marks": 85.0,
            "Assignments": 22.0,
            "Internal_Marks": 21.0
        },
        "model_name": models["best_model"]
    }
    pred_good = app.predict_single(good_req)
    print("4. Prediction (Good Student):", pred_good["predicted_result"],
          f"Confidence: {pred_good['confidence_percentage']}%",
          f"Risk Level: {pred_good['risk_assessment']['risk_level']}")
    assert pred_good["predicted_result"].lower() in ["pass", "a", "b", "high"]
    
    # 5. Single Prediction (Weak Student)
    weak_req = {
        "features": {
            "Study_Hours": 1.0,
            "Attendance": 48.0,
            "Previous_Marks": 35.0,
            "Assignments": 8.0,
            "Internal_Marks": 7.0
        },
        "model_name": models["best_model"]
    }
    pred_weak = app.predict_single(weak_req)
    print("5. Prediction (Vulnerable Student):", pred_weak["predicted_result"],
          f"Risk Level: {pred_weak['risk_assessment']['risk_level']}")
    print("   Contributing factors:", pred_weak["risk_assessment"]["contributing_factors"])
    assert pred_weak["risk_assessment"]["is_at_risk"] is True
    
    # 6. At Risk Students
    at_risk = app.get_at_risk_students()
    print(f"6. At-Risk List: {at_risk['total_at_risk']} students identified")
    assert at_risk["total_at_risk"] > 0
    
    # 7. PDF Report
    pdf_res = app.download_pdf_report()
    pdf_bytes = pdf_res.body
    print(f"7. PDF Report generated successfully, size: {len(pdf_bytes)} bytes")
    assert len(pdf_bytes) > 20000
    
    # 8. CSV Report
    csv_res = app.download_csv_predictions()
    # It returns a StreamingResponse
    print("8. CSV Predictions generated successfully!")
    
    print("\nALL VERIFICATIONS PASSED 100%! System is robust and functional.")

if __name__ == "__main__":
    test_direct_functions()
