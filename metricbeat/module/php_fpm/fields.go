// Licensed to Elasticsearch B.V. under one or more contributor
// license agreements. See the NOTICE file distributed with
// this work for additional information regarding copyright
// ownership. Elasticsearch B.V. licenses this file to you under
// the Apache License, Version 2.0 (the "License"); you may
// not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

// Code generated by beats/dev-tools/cmd/asset/asset.go - DO NOT EDIT.

package php_fpm

import (
	"github.com/elastic/beats/libbeat/asset"
)

func init() {
	if err := asset.SetFields("metricbeat", "php_fpm", Asset); err != nil {
		panic(err)
	}
}

// Asset returns asset data
func Asset() string {
	return "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"
}
