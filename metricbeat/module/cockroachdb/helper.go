// Package cockroachdb is a Metricbeat module that contains MetricSets.
package cockroachdb

import (
	"strconv"
	"time"
)

func ParseTime(nanoseconds string)  (time.Time, error) {
		num, err := strconv.ParseInt(nanoseconds, 10, 64)
		if err != nil {
			return time.Now(), err
		}
	result := time.Unix(0, num)
	return result, nil
}

func ParseSeverity(severityCode int) string {
	switch severityCode {
	case 1:
		return "Error"
	case 2:
		return "Warning"
	case 3:
		return "Info"
	}
	return ""
}
