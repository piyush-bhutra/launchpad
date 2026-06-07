function mapMatchStatus(matchPercentage) {
  if (matchPercentage >= 75) return 'High Match';
  if (matchPercentage >= 50) return 'Good Match';
  if (matchPercentage >= 25) return 'Partial Match';
  return 'Low Match';
}

export function calculateMatch(opportunity, profile) {
  try {
    if (!profile?.skills || profile.skills.length === 0) {
      console.log(`[Matching] No skills found for profile. Opportunity gets 0%.`);
      return { matchPercentage: 0, matchStatus: 'Pending' };
    }

    console.log(`[Matching] Calculating match for "${opportunity.title || 'Opportunity'}" using ${profile.skills.length} stored skills.`);

    const combinedText = [
      opportunity.title,
      opportunity.description,
      opportunity.eligibility,
      ...(opportunity.requiredSkills || []),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    const matched = profile.skills.filter((skill) =>
      combinedText.includes(skill.toLowerCase())
    ).length;

    const requiredSkills = opportunity.requiredSkills || [];
    let matchPercentage;

    if (requiredSkills.length === 0) {
      matchPercentage = 50;
    } else {
      matchPercentage = (matched / requiredSkills.length) * 100;
    }

    matchPercentage = Math.round(Math.min(matchPercentage, 100));

    return {
      matchPercentage,
      matchStatus: mapMatchStatus(matchPercentage),
    };
  } catch (error) {
    console.error('Failed to calculate match:', error.message);
    return { matchPercentage: 0, matchStatus: 'Pending' };
  }
}
