"""
Database & Storage Setup Script for SRM Homes Supabase Project
Project ID: ketsdmnghrzdjubeibvm
"""

import requests
import json
from config import Config

def init_supabase():
    headers = {
        "apikey": Config.SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {Config.SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json"
    }

    print("Checking Supabase connection...")
    res = requests.get(f"{Config.SUPABASE_URL}/rest/v1/", headers=headers)
    if res.status_code >= 500:
        print("Failed to connect to Supabase REST endpoint.")
        return False
    print("Supabase REST connection verified!")

    # Check Storage Buckets: project-images, blog-images
    buckets_url = f"{Config.SUPABASE_URL}/storage/v1/bucket"
    b_res = requests.get(buckets_url, headers=headers)
    existing_buckets = [b.get("id") for b in b_res.json()] if b_res.status_code == 200 else []

    for bucket_name in ["project-images", "blog-images"]:
        if bucket_name not in existing_buckets:
            print(f"Creating storage bucket: {bucket_name}...")
            create_res = requests.post(buckets_url, headers=headers, json={
                "id": bucket_name,
                "name": bucket_name,
                "public": True
            })
            if create_res.status_code in [200, 201]:
                print(f"Bucket {bucket_name} created successfully!")
            else:
                print(f"Bucket creation note: {create_res.text}")
        else:
            print(f"Storage bucket {bucket_name} already exists.")

    print("\n--- SQL Schema Instructions ---")
    print("Please execute backend/schema.sql in the Supabase SQL Editor for project 'ketsdmnghrzdjubeibvm'.")
    print("All tables and RLS policies are prepared in e:\\Construction\\backend\\schema.sql.")
    return True

if __name__ == "__main__":
    init_supabase()
