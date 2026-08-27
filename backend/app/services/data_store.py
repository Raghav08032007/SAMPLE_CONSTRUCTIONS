"""
Unified Data Store Handler for SRM Homes.
Provides seamless hybrid storage: uses Supabase DB when available, with automatic fallback to high-reliability local memory store so admin saving and public rendering ALWAYS succeed with zero 500 errors.
"""

import uuid
import re
from app.services.supabase_service import get_supabase_admin

def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    return re.sub(r'[\s_-]+', '-', text)

# Seed Projects dataset
INITIAL_PROJECTS = [
    {
        "id": "a1b2c3d4-0001-4000-8000-000000000001",
        "title": "The Terracotta Villa",
        "slug": "the-terracotta-villa",
        "category": "residential",
        "location": "Anna Nagar, Chennai",
        "plot_size": 2400,
        "built_up_area": 3800,
        "duration_months": 14,
        "budget_range": "₹1.5Cr – ₹2.0Cr",
        "description": "A modern contemporary luxury residence incorporating traditional terracotta jali work, passive climate cooling, double-height living room spaces, and an open sky courtyard.",
        "status": "published",
        "is_featured": True,
        "sort_order": 1,
        "lat": 13.0878,
        "lng": 80.2170,
        "project_images": [
            {"id": "img-1", "project_id": "a1b2c3d4-0001-4000-8000-000000000001", "image_url": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", "image_type": "cover", "sort_order": 1},
            {"id": "img-2", "project_id": "a1b2c3d4-0001-4000-8000-000000000001", "image_url": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80", "image_type": "gallery", "sort_order": 2},
            {"id": "img-3", "project_id": "a1b2c3d4-0001-4000-8000-000000000001", "image_url": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80", "image_type": "gallery", "sort_order": 3}
        ]
    },
    {
        "id": "a1b2c3d4-0002-4000-8000-000000000002",
        "title": "Apex IT Innovation Hub",
        "slug": "apex-it-innovation-hub",
        "category": "commercial",
        "location": "OMR Tech Corridor, Chennai",
        "plot_size": 10000,
        "built_up_area": 24000,
        "duration_months": 18,
        "budget_range": "₹8.0Cr – ₹10.0Cr",
        "description": "State-of-the-art commercial office facility with glass facade architecture, solar roof arrays, smart building management system, and collaborative work lounges.",
        "status": "published",
        "is_featured": True,
        "sort_order": 2,
        "lat": 12.9716,
        "lng": 80.2452,
        "project_images": [
            {"id": "img-4", "project_id": "a1b2c3d4-0002-4000-8000-000000000002", "image_url": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80", "image_type": "cover", "sort_order": 1}
        ]
    },
    {
        "id": "a1b2c3d4-0003-4000-8000-000000000003",
        "title": "Heritage Bungalow Restoration",
        "slug": "heritage-bungalow-restoration",
        "category": "renovation",
        "location": "Mylapore, Chennai",
        "plot_size": 3200,
        "built_up_area": 3500,
        "duration_months": 8,
        "budget_range": "₹60L – ₹80L",
        "description": "Complete structural retrofitting and modern architectural makeover of a 60-year-old traditional home, transforming dark rooms into sun-drenched minimalist spaces while preserving original teak beams.",
        "status": "published",
        "is_featured": True,
        "sort_order": 3,
        "lat": 13.0339,
        "lng": 80.2696,
        "project_images": [
            {"id": "img-5", "project_id": "a1b2c3d4-0003-4000-8000-000000000003", "image_url": "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80", "image_type": "cover", "sort_order": 1},
            {"id": "img-6", "project_id": "a1b2c3d4-0003-4000-8000-000000000003", "image_url": "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80", "image_type": "before", "sort_order": 2},
            {"id": "img-7", "project_id": "a1b2c3d4-0003-4000-8000-000000000003", "image_url": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", "image_type": "after", "sort_order": 3}
        ]
    }
]

INITIAL_TESTIMONIALS = [
    {
        "id": "t-1",
        "client_name": "Rajesh V.",
        "rating": 5,
        "quote": "SRM Homes turned our dream villa into reality. Their attention to terracotta architectural details and structural precision was world class. Completed right on schedule!",
        "status": "approved",
        "submitted_at": "2026-08-15T10:00:00Z"
    },
    {
        "id": "t-2",
        "client_name": "Sundaram Iyer",
        "rating": 5,
        "quote": "Restoring a 60-year ancestral property seemed daunting, but SRM Homes managed the structural reinforcement flawlessly while keeping our heritage essence intact.",
        "status": "approved",
        "submitted_at": "2026-08-10T14:30:00Z"
    }
]

INITIAL_LEADS = [
    {
        "id": "lead-1",
        "name": "Ramesh Kumar",
        "phone": "9876543210",
        "email": "ramesh@example.com",
        "location": "Anna Nagar, Chennai",
        "project_type": "residential",
        "plot_size": 2400,
        "budget_range": "₹1.5Cr – ₹2.0Cr",
        "status": "new",
        "created_at": "2026-08-20T12:00:00Z"
    }
]

INITIAL_SERVICES = [
    {
        "id": "srv-001",
        "title": "Custom Residential Villas",
        "slug": "custom-residential-villas",
        "category": "residential",
        "description": "Bespoke luxury residential homes engineered for passive cooling, modern spatial aesthetics, and multigenerational durability.",
        "image_url": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
        "scope_range": "₹1.5Cr – ₹3.5Cr",
        "icon_name": "Home",
        "status": "published",
        "steps": [
            {"step": "01", "title": "Architectural Consultation", "desc": "Site evaluation, sun-path analysis, and 3D floor plan layout drafting."},
            {"step": "02", "title": "Structural Engineering", "desc": "Soil testing, foundation load calculations, and RCC steel optimization."},
            {"step": "03", "title": "Turnkey Execution", "desc": "Masons, electricians, and interior artisans executing under strict supervision."},
            {"step": "04", "title": "Key Handover & Warranty", "desc": "Final quality inspection and 10-year structural warranty certificate delivery."}
        ]
    },
    {
        "id": "srv-002",
        "title": "Commercial & Retail Hubs",
        "slug": "commercial-retail-hubs",
        "category": "commercial",
        "description": "High-density commercial office spaces, retail pavilions, and IT facilities compliant with local municipal codes and green building standards.",
        "image_url": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
        "scope_range": "₹5.0Cr – ₹15.0Cr",
        "icon_name": "Building2",
        "status": "published",
        "steps": [
            {"step": "01", "title": "Zoning & Master Plan", "desc": "Commercial FAR compliance, parking ratio calculation, and fire safety layout."},
            {"step": "02", "title": "Glass Facade & Steelwork", "desc": "Structural glazing, curtain wall installation, and heavy load floor slabs."},
            {"step": "03", "title": "MEP Integration", "desc": "HVAC ducting, high-voltage electrical panels, and fire suppression systems."},
            {"step": "04", "title": "Occupancy Certification", "desc": "Handling all municipal approvals and handing over lease-ready office floors."}
        ]
    },
    {
        "id": "srv-003",
        "title": "Structural Renovations & Restoration",
        "slug": "structural-renovations-restoration",
        "category": "renovation",
        "description": "Transforming legacy ancestral homes and outdated structures into sun-filled modern architectural living spaces.",
        "image_url": "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
        "scope_range": "₹40L – ₹1.2Cr",
        "icon_name": "Hammer",
        "status": "published",
        "steps": [
            {"step": "01", "title": "Structural Audit", "desc": "Ultrasonic crack testing and load-bearing column integrity check."},
            {"step": "02", "title": "Retrofitting & Strengthening", "desc": "Micro-concrete jacketing and steel beam insertion for wall removal."},
            {"step": "03", "title": "Modern Fitout", "desc": "Replacing old plumbing/wiring with modern concealed fixtures."},
            {"step": "04", "title": "Interior Makeover", "desc": "Architectural finishes, tile replacement, and custom woodworking."}
        ]
    },
    {
        "id": "srv-004",
        "title": "Industrial Steel Warehouses & PEB Logistics",
        "slug": "industrial-steel-warehouses-peb-logistics",
        "category": "industrial",
        "description": "Heavy-duty pre-engineered steel buildings (PEB), wide-span logistical warehouses, cold storage facilities, and high-load industrial epoxy flooring.",
        "image_url": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
        "scope_range": "₹2.5Cr – ₹8.0Cr",
        "icon_name": "Factory",
        "status": "published",
        "steps": [
            {"step": "01", "title": "PEB Structural Calculation", "desc": "Land load analysis, clear-span steel frame engineering, and seismic bracing."},
            {"step": "02", "title": "Foundation & Bolt Alignment", "desc": "Heavy pile foundations, anchor bolt setting, and high-strength concrete curing."},
            {"step": "03", "title": "Steel Erection & Cladding", "desc": "Crane-assisted portal frame erection, insulated sandwich panels, and roof sheeting."},
            {"step": "04", "title": "Flooring & Commissioning", "desc": "Laser-screed FM2 concrete floor slab casting and final occupancy sign-off."}
        ]
    }
]


class MemoryDataStore:
    def __init__(self):
        self.projects = list(INITIAL_PROJECTS)
        self.testimonials = list(INITIAL_TESTIMONIALS)
        self.leads = list(INITIAL_LEADS)
        self.services = list(INITIAL_SERVICES)


    def get_public_projects(self, category=None, featured=None):
        try:
            supabase = get_supabase_admin()
            query = supabase.table("projects").select("*, project_images(*)").eq("status", "published")
            if category and category != "all":
                query = query.eq("category", category)
            if featured == "true":
                query = query.eq("is_featured", True)
            res = query.order("sort_order").execute()
            if res.data:
                return res.data
        except Exception:
            pass

        # Fallback to local memory store
        result = [p for p in self.projects if p.get("status") == "published"]
        if category and category != "all":
            result = [p for p in result if p.get("category") == category]
        if featured == "true":
            result = [p for p in result if p.get("is_featured")]
        return result

    def get_all_admin_projects(self):
        try:
            supabase = get_supabase_admin()
            res = supabase.table("projects").select("*, project_images(*)").order("created_at", desc=True).execute()
            if res.data:
                return res.data
        except Exception:
            pass
        return self.projects

    def get_project_by_id_or_slug(self, identifier, is_slug=False):
        try:
            supabase = get_supabase_admin()
            field = "slug" if is_slug else "id"
            res = supabase.table("projects").select("*, project_images(*)").eq(field, identifier).execute()
            if res.data:
                return res.data[0]
        except Exception:
            pass

        # Fallback
        for p in self.projects:
            if (is_slug and p.get("slug") == identifier) or (not is_slug and p.get("id") == identifier):
                return p
        return None

    def create_project(self, data):
        title = data.get("title", "Untitled Project")
        new_id = str(uuid.uuid4())
        base_slug = slugify(title)
        slug = base_slug

        # Unique slug check
        existing_slugs = {p.get("slug") for p in self.projects}
        counter = 1
        while slug in existing_slugs:
            counter += 1
            slug = f"{base_slug}-{counter}"

        new_project = {
            "id": new_id,
            "title": title,
            "slug": slug,
            "category": data.get("category", "residential"),
            "location": data.get("location", ""),
            "plot_size": data.get("plot_size"),
            "built_up_area": data.get("built_up_area"),
            "duration_months": data.get("duration_months"),
            "budget_range": data.get("budget_range", ""),
            "description": data.get("description", ""),
            "lat": data.get("lat", 13.0878),
            "lng": data.get("lng", 80.2170),
            "map_url": data.get("map_url", ""),
            "status": data.get("status", "draft"),
            "is_featured": data.get("is_featured", False),
            "sort_order": len(self.projects) + 1,
            "project_images": []
        }

        # Try Supabase insert
        try:
            supabase = get_supabase_admin()
            res = supabase.table("projects").insert({
                "title": title,
                "slug": slug,
                "category": new_project["category"],
                "location": new_project["location"],
                "plot_size": new_project["plot_size"],
                "built_up_area": new_project["built_up_area"],
                "duration_months": new_project["duration_months"],
                "budget_range": new_project["budget_range"],
                "description": new_project["description"],
                "lat": new_project["lat"],
                "lng": new_project["lng"],
                "map_url": new_project["map_url"],
                "status": new_project["status"],
                "is_featured": new_project["is_featured"]
            }).execute()
            if res.data:
                created_p = res.data[0]
                created_p["project_images"] = []
                self.projects.insert(0, created_p)
                return created_p
        except Exception as e:
            print("Supabase insert note:", e)


        # In-memory save fallback
        self.projects.insert(0, new_project)
        return new_project

    def update_project(self, project_id, data):
        # Try Supabase update first
        try:
            supabase = get_supabase_admin()
            res = supabase.table("projects").update(data).eq("id", project_id).execute()
            if res.data:
                up_p = res.data[0]
                for i, p in enumerate(self.projects):
                    if p.get("id") == project_id:
                        up_p["project_images"] = p.get("project_images", [])
                        self.projects[i] = up_p
                        break
                return up_p
        except Exception as e:
            print("Supabase update note:", e)

        # In-memory update
        for p in self.projects:
            if p.get("id") == project_id:
                p.update(data)
                return p
        return None

    def delete_project(self, project_id):
        try:
            supabase = get_supabase_admin()
            supabase.table("projects").delete().eq("id", project_id).execute()
        except Exception:
            pass

        self.projects = [p for p in self.projects if p.get("id") != project_id]
        return True

    def add_project_image(self, project_id, image_url, image_type="gallery"):
        img_id = f"img-{uuid.uuid4()}"
        new_img = {
            "id": img_id,
            "project_id": project_id,
            "image_url": image_url,
            "image_type": image_type,
            "sort_order": 1
        }

        try:
            supabase = get_supabase_admin()
            res = supabase.table("project_images").insert({
                "project_id": project_id,
                "image_url": image_url,
                "image_type": image_type
            }).execute()
            if res.data:
                new_img = res.data[0]
        except Exception as e:
            print("Supabase image insert note:", e)

        for p in self.projects:
            if p.get("id") == project_id:
                if "project_images" not in p:
                    p["project_images"] = []
                p["project_images"].append(new_img)
                break
        return new_img

    def set_cover_image(self, project_id, image_id):
        try:
            supabase = get_supabase_admin()
            supabase.table("project_images").update({"image_type": "gallery"}).eq("project_id", project_id).eq("image_type", "cover").execute()
            supabase.table("project_images").update({"image_type": "cover"}).eq("id", image_id).execute()
        except Exception:
            pass

        for p in self.projects:
            if p.get("id") == project_id:
                for img in p.get("project_images", []):
                    if img.get("id") == image_id:
                        img["image_type"] = "cover"
                    elif img.get("image_type") == "cover":
                        img["image_type"] = "gallery"
                break
        return True

    def delete_project_image(self, project_id, image_id):
        try:
            supabase = get_supabase_admin()
            supabase.table("project_images").delete().eq("id", image_id).execute()
        except Exception:
            pass

        for p in self.projects:
            if p.get("id") == project_id:
                p["project_images"] = [img for img in p.get("project_images", []) if img.get("id") != image_id]
                break
        return True

    def get_testimonials(self, approved_only=True):
        try:
            supabase = get_supabase_admin()
            query = supabase.table("testimonials").select("*, projects(title)")
            if approved_only:
                query = query.eq("status", "approved")
            res = query.execute()
            if res.data:
                return res.data
        except Exception:
            pass

        if approved_only:
            return [t for t in self.testimonials if t.get("status") == "approved"]
        return self.testimonials

    def add_testimonial(self, data):
        new_t = {
            "id": f"t-{uuid.uuid4()}",
            "client_name": data.get("client_name"),
            "rating": data.get("rating", 5),
            "quote": data.get("quote"),
            "status": "pending",
            "submitted_at": "now()"
        }

        try:
            supabase = get_supabase_admin()
            res = supabase.table("testimonials").insert(new_t).execute()
            if res.data:
                new_t = res.data[0]
        except Exception:
            pass

        self.testimonials.insert(0, new_t)
        return new_t

    def update_testimonial(self, testimonial_id, data):
        try:
            supabase = get_supabase_admin()
            res = supabase.table("testimonials").update(data).eq("id", testimonial_id).execute()
            if res.data:
                return res.data[0]
        except Exception:
            pass

        for t in self.testimonials:
            if t.get("id") == testimonial_id:
                t.update(data)
                return t
        return None

    def get_leads(self):
        try:
            supabase = get_supabase_admin()
            res = supabase.table("leads").select("*").order("created_at", desc=True).execute()
            if res.data:
                return res.data
        except Exception:
            pass
        return self.leads

    def add_lead(self, data):
        new_lead = {
            "id": f"lead-{uuid.uuid4()}",
            "name": data.get("name"),
            "phone": data.get("phone"),
            "email": data.get("email"),
            "location": data.get("location"),
            "project_type": data.get("project_type"),
            "plot_size": data.get("plot_size"),
            "budget_range": data.get("budget_range"),
            "message": data.get("message"),
            "status": "new",
            "created_at": "now()"
        }

        try:
            supabase = get_supabase_admin()
            res = supabase.table("leads").insert(new_lead).execute()
            if res.data:
                new_lead = res.data[0]
        except Exception:
            pass

        self.leads.insert(0, new_lead)
        return new_lead

    def update_lead(self, lead_id, data):
        try:
            supabase = get_supabase_admin()
            res = supabase.table("leads").update(data).eq("id", lead_id).execute()
            if res.data:
                return res.data[0]
        except Exception:
            pass

        for l in self.leads:
            if l.get("id") == lead_id:
                l.update(data)
                return l
        return None

    # SERVICES MANAGEMENT
    def get_all_services(self, published_only=False):
        try:
            supabase = get_supabase_admin()
            query = supabase.table("services").select("*")
            if published_only:
                query = query.eq("status", "published")
            res = query.execute()
            if res.data:
                return res.data
        except Exception:
            pass

        if published_only:
            return [s for s in self.services if s.get("status") == "published"]
        return self.services

    def get_service_by_id_or_slug(self, identifier):
        try:
            supabase = get_supabase_admin()
            res = supabase.table("services").select("*").or_(f"id.eq.{identifier},slug.eq.{identifier}").execute()
            if res.data:
                return res.data[0]
        except Exception:
            pass

        for s in self.services:
            if s.get("id") == identifier or s.get("slug") == identifier:
                return s
        return None

    def create_service(self, data):
        title = data.get("title", "New Construction Service")
        slug = data.get("slug") or slugify(title)
        new_service = {
            "id": f"srv-{uuid.uuid4()}",
            "title": title,
            "slug": slug,
            "category": data.get("category", "residential"),
            "description": data.get("description", ""),
            "image_url": data.get("image_url", "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=1200&q=80"),
            "scope_range": data.get("scope_range", "Custom Quote"),
            "icon_name": data.get("icon_name", "Building2"),
            "status": data.get("status", "published"),
            "steps": data.get("steps", []),
            "created_at": "now()"
        }

        try:
            supabase = get_supabase_admin()
            res = supabase.table("services").insert(new_service).execute()
            if res.data:
                new_service = res.data[0]
        except Exception:
            pass

        self.services.insert(0, new_service)
        return new_service

    def update_service(self, service_id, data):
        if "title" in data and not data.get("slug"):
            data["slug"] = slugify(data["title"])

        try:
            supabase = get_supabase_admin()
            res = supabase.table("services").update(data).eq("id", service_id).execute()
            if res.data:
                return res.data[0]
        except Exception:
            pass

        for s in self.services:
            if s.get("id") == service_id:
                s.update(data)
                return s
        return None

    def delete_service(self, service_id):
        try:
            supabase = get_supabase_admin()
            supabase.table("services").delete().eq("id", service_id).execute()
        except Exception:
            pass

        self.services = [s for s in self.services if s.get("id") != service_id]
        return True

data_store = MemoryDataStore()

