import json


# LOAD SKILLS JSON
with open("ml/skill_extraction/skills.json", "r") as file:
    skills_list = json.load(file)


def extract_skills(text):

    # Convert to lowercase
    text = str(text).lower()

    extracted_skills = []

    # Find matching skills
    for skill in skills_list:

        if skill.lower() in text:

            extracted_skills.append(skill)

    # Remove duplicates
    extracted_skills = list(set(extracted_skills))

    return extracted_skills


# TEST
if __name__ == "__main__":

    sample_text = """
    I know Python, React, Machine Learning,
    FastAPI and Docker.
    """

    result = extract_skills(sample_text)

    print("\nEXTRACTED SKILLS:\n")

    print(result)