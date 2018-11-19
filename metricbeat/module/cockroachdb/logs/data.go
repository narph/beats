package logs

import (
	"encoding/json"
	"github.com/elastic/beats/libbeat/common"
	"github.com/elastic/beats/metricbeat/mb"
	"github.com/elastic/beats/metricbeat/module/cockroachdb"
)

type cockroachDBstatus struct {
	Entries []cockroachDBentry `json:"entries"`
}

type cockroachDBentry struct {
	Severity               int     `json:"severity"`
	Message string `json:"message"`
	Time string `json:"time"`
	Goroutine string `json:"goroutine"`
	File string `json:"file"`
	Line string `json:"line"`
}

func eventsMapping(r mb.ReporterV2, content []byte) {
	var status cockroachDBstatus
	err := json.Unmarshal(content, &status)
	if err != nil {
		r.Error(err)
		return
	}
	for _, entry := range status.Entries {
		result, err := cockroachdb.ParseTime(entry.Time)
		if err != nil {
			r.Error(err)
			return
		}
		log := common.MapStr{
			"severity": cockroachdb.ParseSeverity(entry.Severity),
			"message": entry.Message,
			"time": result,
			"line": entry.Line,
			"goroutine": entry.Goroutine,
			"file": entry.File,

		}
		event := mb.Event{MetricSetFields: log}
		r.Event(event)
	}
}
