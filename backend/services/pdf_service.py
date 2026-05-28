import re
from io import BytesIO
from typing import Dict, List

import PyPDF2

try:
    import pdfplumber
    PDFPLUMBER_AVAILABLE = True
except:
    PDFPLUMBER_AVAILABLE = False


class PDFService:

    # ==========================================
    # MAIN FUNCTION (FIXED - BACKWARD SAFE)
    # ==========================================

    @staticmethod
    def extract_text_from_pdf(file_content: bytes) -> Dict:
        """
        Production-grade PDF extraction

        FIX: Now safely returns DICT but also ensures
        backward compatibility with string usage.
        """

        try:

            # ==========================================
            # TRY PDFPLUMBER FIRST
            # ==========================================

            if PDFPLUMBER_AVAILABLE:
                result = PDFService._extract_with_pdfplumber(file_content)
            else:
                result = PDFService._extract_with_pypdf2(file_content)

            # ==========================================
            # CLEAN TEXT
            # ==========================================

            cleaned_text = PDFService._clean_text(result["raw_text"])

            # ==========================================
            # DETECT SECTIONS
            # ==========================================

            sections = PDFService._detect_sections(cleaned_text)

            # ==========================================
            # QUALITY SCORE
            # ==========================================

            quality_score = PDFService._calculate_quality_score(cleaned_text)

            # ==========================================
            # FINAL RESPONSE (DICTIONARY - SAME AS BEFORE)
            # ==========================================

            return {
                "raw_text": result["raw_text"],
                "cleaned_text": cleaned_text,
                "total_pages": result["total_pages"],
                "extracted_chars": len(cleaned_text),
                "detected_sections": sections,
                "quality_score": quality_score
            }

        except Exception as e:
            raise Exception(f"PDF extraction failed: {str(e)}")

    # ==========================================
    # PDFPLUMBER EXTRACTION
    # ==========================================

    @staticmethod
    def _extract_with_pdfplumber(file_content: bytes) -> Dict:

        import pdfplumber

        text = ""
        total_pages = 0

        pdf_stream = BytesIO(file_content)

        with pdfplumber.open(pdf_stream) as pdf:

            total_pages = len(pdf.pages)

            for page in pdf.pages:
                page_text = page.extract_text()

                if page_text:
                    text += page_text + "\n"

        return {
            "raw_text": text.strip(),
            "total_pages": total_pages
        }

    # ==========================================
    # FALLBACK PYPDF2
    # ==========================================

    @staticmethod
    def _extract_with_pypdf2(file_content: bytes) -> Dict:

        pdf_file = BytesIO(file_content)
        pdf_reader = PyPDF2.PdfReader(pdf_file)

        text = ""

        for page in pdf_reader.pages:
            page_text = page.extract_text()

            if page_text:
                text += page_text + "\n"

        return {
            "raw_text": text.strip(),
            "total_pages": len(pdf_reader.pages)
        }

    # ==========================================
    # CLEAN TEXT
    # ==========================================

    @staticmethod
    def _clean_text(text: str) -> str:

        if not text:
            return ""

        text = re.sub(r"[\x00-\x1f\x7f-\x9f]", " ", text)
        text = re.sub(r"\s+", " ", text)
        text = re.sub(r"\.{2,}", ".", text)

        text = text.replace("•", " ")
        text = text.replace("▪", " ")
        text = text.replace("◦", " ")

        return text.strip()

    # ==========================================
    # DETECT SECTIONS
    # ==========================================

    @staticmethod
    def _detect_sections(text: str) -> List[str]:

        section_patterns = {
            "summary": ["summary", "profile", "objective", "about me"],
            "skills": ["skills", "technical skills", "core competencies", "technologies"],
            "experience": ["experience", "work experience", "employment", "professional experience"],
            "projects": ["projects", "personal projects", "academic projects"],
            "education": ["education", "academic background"],
            "certifications": ["certifications", "licenses"],
            "achievements": ["achievements", "awards", "accomplishments"]
        }

        found_sections = []
        text_lower = text.lower()

        for section, keywords in section_patterns.items():

            for keyword in keywords:
                if keyword in text_lower:
                    found_sections.append(section.upper())
                    break

        return found_sections

    # ==========================================
    # QUALITY SCORE
    # ==========================================

    @staticmethod
    def _calculate_quality_score(text: str) -> float:

        score = 100
        word_count = len(text.split())

        if word_count < 100:
            score -= 40
        elif word_count < 250:
            score -= 15

        important_sections = ["skills", "experience", "education"]

        lower_text = text.lower()

        for section in important_sections:
            if section not in lower_text:
                score -= 10

        weird_char_ratio = (
            len(re.findall(r"[^a-zA-Z0-9\s.,%-]", text))
            / max(len(text), 1)
        )

        if weird_char_ratio > 0.20:
            score -= 30

        return max(score, 0)

    # ==========================================
    # CONTACT EXTRACTION
    # ==========================================

    @staticmethod
    def extract_contact_info(text: str) -> Dict:

        email_pattern = r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
        phone_pattern = r"(\+91[-\s]?)?[6-9]\d{9}"
        linkedin_pattern = r"(linkedin\.com/in/[A-Za-z0-9_-]+)"
        github_pattern = r"(github\.com/[A-Za-z0-9_-]+)"

        emails = re.findall(email_pattern, text)
        phones = re.findall(phone_pattern, text)
        linkedin = re.findall(linkedin_pattern, text)
        github = re.findall(github_pattern, text)

        return {
            "emails": list(set(emails)),
            "phones": list(set(phones)),
            "linkedin": list(set(linkedin)),
            "github": list(set(github))
        }

    # ==========================================
    # EXPERIENCE EXTRACTION
    # ==========================================

    @staticmethod
    def extract_experience_years(text: str) -> int:

        patterns = [
            r"(\d+)\+?\s+years",
            r"(\d+)\+?\s+yrs",
            r"experience\s+of\s+(\d+)",
            r"worked\s+for\s+(\d+)"
        ]

        years = []

        for pattern in patterns:
            matches = re.findall(pattern, text.lower())

            for match in matches:
                try:
                    years.append(int(match))
                except:
                    pass

        return max(years) if years else 0

    # ==========================================
    # VALIDATION
    # ==========================================

    @staticmethod
    def validate_resume(text: str) -> Dict:

        issues = []

        if len(text.split()) < 100:
            issues.append("Resume content is too short")

        if "skills" not in text.lower():
            issues.append("Skills section missing")

        if "experience" not in text.lower():
            issues.append("Experience section missing")

        if "education" not in text.lower():
            issues.append("Education section missing")

        return {
            "is_valid": len(issues) == 0,
            "issues": issues
        }


pdf_service = PDFService()

