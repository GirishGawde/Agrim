from typing import List, Dict, Any

def merge_reports(reports: List[Dict[Any, Any]]) -> List[Dict[Any, Any]]:
    """
    Logic to group/merge reports from the same place and time.
    """
    merged = []
    seen = set()
    
    for report in reports:
        # Simplistic grouping key: (lat, lng, hazard_type)
        key = (report.get('lat'), report.get('lng'), report.get('hazard_type'))
        if key not in seen:
            seen.add(key)
            report['duplicate_count'] = 1
            merged.append(report)
        else:
            # Increment existing
            for m in merged:
                if (m.get('lat'), m.get('lng'), m.get('hazard_type')) == key:
                    m['duplicate_count'] = m.get('duplicate_count', 1) + 1
                    break
                    
    return merged
