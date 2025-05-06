def extract_organization_id_from_email(email: str) -> int:
    """
    Extracts the organization ID from the email address.
    Assumes the email format is 'user@organization_id.domain.com'.
    """
    try:
        # Split the email by '@' and take the first part
        local_part = email.split('@')[0]
        # Split the local part by '.' and take the last part as organization ID
        organization_id = int(local_part.split('.')[-1])
        return organization_id
    except (IndexError, ValueError):
        raise ValueError("Invalid email format. Unable to extract organization ID.")
