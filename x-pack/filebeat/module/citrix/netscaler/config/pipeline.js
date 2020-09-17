//  Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
//  or more contributor license agreements. Licensed under the Elastic License;
//  you may not use this file except in compliance with the Elastic License.
var tvm = {
	pair_separator: " ",
	kv_separator: "=",
	open_quote: "\"",
	close_quote: "\"",
};

function DeviceProcessor() {
	var builder = new processor.Chain();
	builder.Add(save_flags);
	builder.Add(strip_syslog_priority);
	builder.Add(chain1);
	builder.Add(populate_fields);
	builder.Add(restore_flags);
	var chain = builder.Build();
	return {
		process: chain.Run,
	}
}

var map_getEventLegacyCategoryName = {
	keyvaluepairs: {
		"1204010000": constant("Content.Web Traffic.Successful"),
		"1204020000": constant("Content.Web Traffic.Denied"),
	},
	"default": constant("Other.Default"),
};

var map_getEventLegacyCategory = {
	keyvaluepairs: {
		"blocked": constant("1204020000"),
		"not blocked": constant("1204010000"),
	},
	"default": constant("1901000000"),
};

var dup1 = call({
	dest: "nwparser.messageid",
	fn: STRCAT,
	args: [
		field("msgIdPart1"),
		constant("_"),
		field("msgIdPart2"),
	],
});

var dup2 = setc("eventcategory","1605020000");

var dup3 = setc("severity","Informational");

var dup4 = date_time({
	dest: "event_time",
	args: ["hdatetime"],
	fmts: [
		[dG,dc("/"),dF,dc("/"),dW,dc(":"),dH,dc(":"),dU,dc(":"),dO],
	],
});

var dup5 = setc("eventcategory","1401030000");

var dup6 = setc("ec_activity","Logon");

var dup7 = setc("ec_theme","Authentication");

var dup8 = setc("ec_outcome","Failure");

var dup9 = setc("eventcategory","1605000000");

var dup10 = setc("severity","Notice");

var dup11 = setc("eventcategory","1603000000");

var dup12 = setc("eventcategory","1201000000");

var dup13 = setc("event_description","AppFw Buffer Overflow violation in URL");

var dup14 = // "Pattern{Field(saddr,true), Constant(' '), Field(p0,false)}"
match("MESSAGE#6:APPFW_APPFW_COOKIE/0", "nwparser.payload", "%{saddr->} %{p0}");

var dup15 = // "Pattern{Field(url,true), Constant(' <<'), Field(disposition,false), Constant('>')}"
match("MESSAGE#7:APPFW_APPFW_DENYURL/2", "nwparser.p0", "%{url->} \u003c\u003c%{disposition}>");

var dup16 = // "Pattern{Field(url,true), Constant(' '), Field(info,true), Constant(' <<'), Field(disposition,false), Constant('>')}"
match("MESSAGE#8:APPFW_APPFW_FIELDCONSISTENCY/2", "nwparser.p0", "%{url->} %{info->} \u003c\u003c%{disposition}>");

var dup17 = setc("event_description","AppFw SQL Injection violation");

var dup18 = setc("event_description","AppFw Request error. Generated 400 Response");

var dup19 = setc("severity","Warning");

var dup20 = // "Pattern{Constant('"'), Field(p0,false)}"
match("MESSAGE#20:APPFW_Message/0", "nwparser.payload", "\"%{p0}");

var dup21 = // "Pattern{Constant('HASTATE '), Field(p0,false)}"
match("MESSAGE#23:DR_HA_Message/1_0", "nwparser.p0", "HASTATE %{p0}");

var dup22 = // "Pattern{Field(network_service,false), Constant(': '), Field(p0,false)}"
match("MESSAGE#23:DR_HA_Message/1_1", "nwparser.p0", "%{network_service}: %{p0}");

var dup23 = // "Pattern{Field(info,false), Constant('"')}"
match("MESSAGE#23:DR_HA_Message/2", "nwparser.p0", "%{info}\"");

var dup24 = setc("event_description","Routing details");

var dup25 = // "Pattern{Constant('for '), Field(dclass_counter1,false)}"
match("MESSAGE#24:EVENT_ALERTENDED/1_0", "nwparser.p0", "for %{dclass_counter1}");

var dup26 = // "Pattern{Field(space,false)}"
match_copy("MESSAGE#24:EVENT_ALERTENDED/1_1", "nwparser.p0", "space");

var dup27 = setc("ec_subject","Configuration");

var dup28 = setc("ec_activity","Stop");

var dup29 = setc("ec_theme","Configuration");

var dup30 = setc("ec_activity","Start");

var dup31 = // "Pattern{Field(obj_type,true), Constant(' "'), Field(obj_name,false), Constant('"'), Field(p0,false)}"
match("MESSAGE#28:EVENT_DEVICEDOWN/0", "nwparser.payload", "%{obj_type->} \"%{obj_name}\"%{p0}");

var dup32 = // "Pattern{Constant(' - State '), Field(event_state,false)}"
match("MESSAGE#28:EVENT_DEVICEDOWN/1_0", "nwparser.p0", " - State %{event_state}");

var dup33 = // "Pattern{}"
match_copy("MESSAGE#28:EVENT_DEVICEDOWN/1_1", "nwparser.p0", "");

var dup34 = setc("ec_subject","Service");

var dup35 = date_time({
	dest: "event_time",
	args: ["hdatetime"],
	fmts: [
		[dG,dc("/"),dF,dc("/"),dW,dc(":"),dH,dc(":"),dU,dc(":"),dO],
		[dW,dc("/"),dG,dc("/"),dF,dc(":"),dH,dc(":"),dU,dc(":"),dO],
	],
});

var dup36 = // "Pattern{Field(obj_type,true), Constant(' '), Field(p0,false)}"
match("MESSAGE#31:EVENT_MONITORDOWN/0", "nwparser.payload", "%{obj_type->} %{p0}");

var dup37 = // "Pattern{Field(obj_name,true), Constant(' - State '), Field(event_state,false)}"
match("MESSAGE#31:EVENT_MONITORDOWN/1_0", "nwparser.p0", "%{obj_name->} - State %{event_state}");

var dup38 = // "Pattern{Constant(''), Field(obj_name,false)}"
match("MESSAGE#31:EVENT_MONITORDOWN/1_2", "nwparser.p0", "%{obj_name}");

var dup39 = setc("event_description","The monitor bound to the service is up");

var dup40 = setc("ec_subject","NetworkComm");

var dup41 = setc("severity","Debug");

var dup42 = // "Pattern{Constant('" '), Field(p0,false)}"
match("MESSAGE#45:PITBOSS_Message1/0", "nwparser.payload", "\" %{p0}");

var dup43 = // "Pattern{Constant(''), Field(info,false), Constant('"')}"
match("MESSAGE#45:PITBOSS_Message1/2", "nwparser.p0", "%{info}\"");

var dup44 = date_time({
	dest: "starttime",
	args: ["fld10"],
	fmts: [
		[dB,dF,dH,dc(":"),dU,dc(":"),dO,dW],
	],
});

var dup45 = setc("event_description","Process");

var dup46 = // "Pattern{Constant('sysIpAddress = '), Field(hostip,false), Constant(')')}"
match("MESSAGE#54:SNMP_TRAP_SENT7/3_3", "nwparser.p0", "sysIpAddress = %{hostip})");

var dup47 = setc("event_description","SNMP TRAP SENT");

var dup48 = // "Pattern{Field(,true), Constant(' '), Field(p0,false)}"
match("MESSAGE#86:SSLLOG_SSL_HANDSHAKE_FAILURE/0", "nwparser.payload", "%{} %{p0}");

var dup49 = // "Pattern{Constant('ClientIP '), Field(p0,false)}"
match("MESSAGE#86:SSLLOG_SSL_HANDSHAKE_FAILURE/1_0", "nwparser.p0", "ClientIP %{p0}");

var dup50 = date_time({
	dest: "event_time",
	args: ["hdatetime"],
	fmts: [
		[dM,dc("/"),dD,dc("/"),dW,dc(":"),dH,dc(":"),dU,dc(":"),dO],
		[dD,dc("/"),dM,dc("/"),dW,dc(":"),dH,dc(":"),dU,dc(":"),dO],
	],
});

var dup51 = setc("ec_activity","Request");

var dup52 = // "Pattern{Constant('" '), Field(fld10,true), Constant(' GMT" - End_time '), Field(p0,false)}"
match("MESSAGE#93:SSLVPN_ICAEND_CONNSTAT/1_0", "nwparser.p0", "\" %{fld10->} GMT\" - End_time %{p0}");

var dup53 = // "Pattern{Constant('" '), Field(fld10,false), Constant('" - End_time '), Field(p0,false)}"
match("MESSAGE#93:SSLVPN_ICAEND_CONNSTAT/1_1", "nwparser.p0", "\" %{fld10}\" - End_time %{p0}");

var dup54 = // "Pattern{Field(fld10,true), Constant(' - End_time '), Field(p0,false)}"
match("MESSAGE#93:SSLVPN_ICAEND_CONNSTAT/1_2", "nwparser.p0", "%{fld10->} - End_time %{p0}");

var dup55 = // "Pattern{Constant('" '), Field(fld11,true), Constant(' GMT" - Duration '), Field(p0,false)}"
match("MESSAGE#93:SSLVPN_ICAEND_CONNSTAT/2_0", "nwparser.p0", "\" %{fld11->} GMT\" - Duration %{p0}");

var dup56 = // "Pattern{Constant('" '), Field(fld11,false), Constant('" - Duration '), Field(p0,false)}"
match("MESSAGE#93:SSLVPN_ICAEND_CONNSTAT/2_1", "nwparser.p0", "\" %{fld11}\" - Duration %{p0}");

var dup57 = // "Pattern{Field(fld11,true), Constant(' - Duration '), Field(p0,false)}"
match("MESSAGE#93:SSLVPN_ICAEND_CONNSTAT/2_2", "nwparser.p0", "%{fld11->} - Duration %{p0}");

var dup58 = setc("event_description","ICA connection related information for a connection belonging to a SSLVPN session");

var dup59 = setc("dclass_ratio1_string"," Compression_ratio_send");

var dup60 = setc("dclass_ratio2_string"," Compression_ratio_recv");

var dup61 = date_time({
	dest: "endtime",
	args: ["fld11"],
	fmts: [
		[dG,dc("/"),dF,dc("/"),dW,dc(":"),dH,dc(":"),dU,dc(":"),dO],
	],
});

var dup62 = date_time({
	dest: "starttime",
	args: ["fld10"],
	fmts: [
		[dG,dc("/"),dF,dc("/"),dW,dc(":"),dH,dc(":"),dU,dc(":"),dO],
	],
});

var dup63 = // "Pattern{Constant('Context '), Field(fld1,true), Constant(' - SessionId: '), Field(sessionid,false), Constant('- User '), Field(p0,false)}"
match("MESSAGE#94:SSLVPN_LOGIN/1_0", "nwparser.p0", "Context %{fld1->} - SessionId: %{sessionid}- User %{p0}");

var dup64 = // "Pattern{Constant('Context '), Field(fld1,true), Constant(' - User '), Field(p0,false)}"
match("MESSAGE#94:SSLVPN_LOGIN/1_1", "nwparser.p0", "Context %{fld1->} - User %{p0}");

var dup65 = // "Pattern{Constant('User '), Field(p0,false)}"
match("MESSAGE#94:SSLVPN_LOGIN/1_2", "nwparser.p0", "User %{p0}");

var dup66 = // "Pattern{Field(,true), Constant(' '), Field(username,false), Constant('- Client_ip '), Field(saddr,true), Constant(' - Nat_ip '), Field(p0,false)}"
match("MESSAGE#94:SSLVPN_LOGIN/2", "nwparser.p0", "%{} %{username}- Client_ip %{saddr->} - Nat_ip %{p0}");

var dup67 = // "Pattern{Constant('"'), Field(stransaddr,false), Constant('" - Vserver '), Field(p0,false)}"
match("MESSAGE#94:SSLVPN_LOGIN/3_0", "nwparser.p0", "\"%{stransaddr}\" - Vserver %{p0}");

var dup68 = // "Pattern{Field(stransaddr,true), Constant(' - Vserver '), Field(p0,false)}"
match("MESSAGE#94:SSLVPN_LOGIN/3_1", "nwparser.p0", "%{stransaddr->} - Vserver %{p0}");

var dup69 = setc("eventcategory","1401060000");

var dup70 = // "Pattern{Field(daddr,false), Constant(':'), Field(dport,true), Constant(' - Start_time '), Field(p0,false)}"
match("MESSAGE#95:SSLVPN_LOGOUT/4", "nwparser.p0", "%{daddr}:%{dport->} - Start_time %{p0}");

var dup71 = setc("eventcategory","1401070000");

var dup72 = setc("ec_activity","Logoff");

var dup73 = // "Pattern{Constant('Context '), Field(fld1,true), Constant(' - SessionId: '), Field(sessionid,false), Constant('- User '), Field(username,true), Constant(' - Client_ip '), Field(hostip,true), Constant(' - Nat_ip '), Field(p0,false)}"
match("MESSAGE#97:SSLVPN_UDPFLOWSTAT/0", "nwparser.payload", "Context %{fld1->} - SessionId: %{sessionid}- User %{username->} - Client_ip %{hostip->} - Nat_ip %{p0}");

var dup74 = // "Pattern{Field(,false), Constant('"'), Field(p0,false)}"
match("MESSAGE#100:SSLVPN_Message/0", "nwparser.payload", "%{}\"%{p0}");

var dup75 = // "Pattern{Constant('Source '), Field(saddr,false), Constant(':'), Field(sport,true), Constant(' - Vserver '), Field(daddr,false), Constant(':'), Field(dport,true), Constant(' - NatIP '), Field(stransaddr,false), Constant(':'), Field(stransport,true), Constant(' - Destination '), Field(dtransaddr,false), Constant(':'), Field(dtransport,true), Constant(' - Delink Time '), Field(p0,false)}"
match("MESSAGE#102:TCP_CONN_DELINK/0", "nwparser.payload", "Source %{saddr}:%{sport->} - Vserver %{daddr}:%{dport->} - NatIP %{stransaddr}:%{stransport->} - Destination %{dtransaddr}:%{dtransport->} - Delink Time %{p0}");

var dup76 = // "Pattern{Field(fld11,true), Constant(' GMT - Total_bytes_send '), Field(p0,false)}"
match("MESSAGE#102:TCP_CONN_DELINK/1_0", "nwparser.p0", "%{fld11->} GMT - Total_bytes_send %{p0}");

var dup77 = // "Pattern{Field(fld11,true), Constant(' - Total_bytes_send '), Field(p0,false)}"
match("MESSAGE#102:TCP_CONN_DELINK/1_1", "nwparser.p0", "%{fld11->} - Total_bytes_send %{p0}");

var dup78 = // "Pattern{Field(sbytes,true), Constant(' - Total_bytes_recv '), Field(rbytes,false)}"
match("MESSAGE#102:TCP_CONN_DELINK/2", "nwparser.p0", "%{sbytes->} - Total_bytes_recv %{rbytes}");

var dup79 = setc("event_description","A Server side and a Client side TCP connection is delinked");

var dup80 = // "Pattern{Constant('Source '), Field(saddr,false), Constant(':'), Field(sport,true), Constant(' - Destination '), Field(daddr,false), Constant(':'), Field(dport,true), Constant(' - Start Time '), Field(p0,false)}"
match("MESSAGE#103:TCP_CONN_TERMINATE/0", "nwparser.payload", "Source %{saddr}:%{sport->} - Destination %{daddr}:%{dport->} - Start Time %{p0}");

var dup81 = // "Pattern{Field(fld10,true), Constant(' GMT - End Time '), Field(p0,false)}"
match("MESSAGE#103:TCP_CONN_TERMINATE/1_0", "nwparser.p0", "%{fld10->} GMT - End Time %{p0}");

var dup82 = // "Pattern{Field(fld10,true), Constant(' - End Time '), Field(p0,false)}"
match("MESSAGE#103:TCP_CONN_TERMINATE/1_1", "nwparser.p0", "%{fld10->} - End Time %{p0}");

var dup83 = setc("event_description","TCP connection terminated");

var dup84 = setc("event_description","UI command executed in NetScaler");

var dup85 = setc("disposition","Success");

var dup86 = call({
	dest: "nwparser.action",
	fn: STRCAT,
	args: [
		field("login"),
		field("fld11"),
	],
});

var dup87 = call({
	dest: "nwparser.action",
	fn: STRCAT,
	args: [
		field("logout"),
		field("fld11"),
	],
});

var dup88 = setc("eventcategory","1401040000");

var dup89 = setc("event_description","CLI or GUI command executed in NetScaler");

var dup90 = // "Pattern{Field(info,true), Constant(' "')}"
match("MESSAGE#113:CLUSTERD_Message:02/1_1", "nwparser.p0", "%{info->} \"");

var dup91 = setf("msg","$MSG");

var dup92 = setc("event_description","GUI command executed in NetScaler");

var dup93 = // "Pattern{Constant('"'), Field(event_type,false), Constant(': '), Field(p0,false)}"
match("MESSAGE#158:AAA_Message/0", "nwparser.payload", "\"%{event_type}: %{p0}");

var dup94 = // "Pattern{Constant('Sessionid '), Field(sessionid,true), Constant(' - User '), Field(username,true), Constant(' - Client_ip '), Field(saddr,true), Constant(' - Nat_ip '), Field(p0,false)}"
match("MESSAGE#167:SSLVPN_REMOVE_SESSION_ERR/0", "nwparser.payload", "Sessionid %{sessionid->} - User %{username->} - Client_ip %{saddr->} - Nat_ip %{p0}");

var dup95 = // "Pattern{Constant('"'), Field(stransaddr,false), Constant('" - Vserver_ip '), Field(p0,false)}"
match("MESSAGE#167:SSLVPN_REMOVE_SESSION_ERR/1_0", "nwparser.p0", "\"%{stransaddr}\" - Vserver_ip %{p0}");

var dup96 = // "Pattern{Field(stransaddr,true), Constant(' - Vserver_ip '), Field(p0,false)}"
match("MESSAGE#167:SSLVPN_REMOVE_SESSION_ERR/1_1", "nwparser.p0", "%{stransaddr->} - Vserver_ip %{p0}");

var dup97 = // "Pattern{Field(daddr,true), Constant(' - Errmsg " '), Field(event_description,true), Constant(' "')}"
match("MESSAGE#167:SSLVPN_REMOVE_SESSION_ERR/2", "nwparser.p0", "%{daddr->} - Errmsg \" %{event_description->} \"");

var dup98 = linear_select([
	dup21,
	dup22,
]);

var dup99 = linear_select([
	dup25,
	dup26,
]);

var dup100 = linear_select([
	dup32,
	dup33,
]);

var dup101 = // "Pattern{Field(fld1,false), Constant(':UserLogin:'), Field(username,true), Constant(' - '), Field(event_description,true), Constant(' from client IP Address '), Field(saddr,false)}"
match("MESSAGE#84:SNMP_TRAP_SENT:05", "nwparser.payload", "%{fld1}:UserLogin:%{username->} - %{event_description->} from client IP Address %{saddr}", processor_chain([
	dup5,
	dup4,
]));

var dup102 = linear_select([
	dup52,
	dup53,
	dup54,
]);

var dup103 = linear_select([
	dup55,
	dup56,
	dup57,
]);

var dup104 = linear_select([
	dup63,
	dup64,
	dup65,
]);

var dup105 = linear_select([
	dup67,
	dup68,
]);

var dup106 = linear_select([
	dup76,
	dup77,
]);

var dup107 = linear_select([
	dup81,
	dup82,
]);

var dup108 = // "Pattern{Constant('User '), Field(username,true), Constant(' - Remote_ip '), Field(saddr,true), Constant(' - Command "'), Field(action,false), Constant('" - Status "'), Field(disposition,false), Constant('"')}"
match("MESSAGE#109:UI_CMD_EXECUTED", "nwparser.payload", "User %{username->} - Remote_ip %{saddr->} - Command \"%{action}\" - Status \"%{disposition}\"", processor_chain([
	dup88,
	dup89,
	dup3,
	dup4,
]));

var dup109 = // "Pattern{Field(product,false), Constant('|'), Field(version,false), Constant('|'), Field(rule,false), Constant('|'), Field(fld1,false), Constant('|'), Field(severity,false), Constant('|src='), Field(saddr,true), Constant(' spt='), Field(sport,true), Constant(' method='), Field(web_method,true), Constant(' request='), Field(url,true), Constant(' msg='), Field(info,true), Constant(' cn1='), Field(fld2,true), Constant(' cn2='), Field(fld3,true), Constant(' cs1='), Field(policyname,true), Constant(' cs2='), Field(fld5,true), Constant(' cs3='), Field(fld6,true), Constant(' cs4='), Field(severity,true), Constant(' cs5='), Field(fld8,true), Constant(' act='), Field(action,false)}"
match("MESSAGE#122:APPFW_COOKIE", "nwparser.payload", "%{product}|%{version}|%{rule}|%{fld1}|%{severity}|src=%{saddr->} spt=%{sport->} method=%{web_method->} request=%{url->} msg=%{info->} cn1=%{fld2->} cn2=%{fld3->} cs1=%{policyname->} cs2=%{fld5->} cs3=%{fld6->} cs4=%{severity->} cs5=%{fld8->} act=%{action}", processor_chain([
	dup9,
	dup91,
]));

var dup110 = // "Pattern{Field(product,false), Constant('|'), Field(version,false), Constant('|'), Field(rule,false), Constant('|'), Field(fld1,false), Constant('|'), Field(severity,false), Constant('|src='), Field(saddr,true), Constant(' spt='), Field(sport,true), Constant(' method='), Field(web_method,true), Constant(' request='), Field(url,true), Constant(' msg='), Field(info,true), Constant(' cn1='), Field(fld2,true), Constant(' cn2='), Field(fld3,true), Constant(' cs1='), Field(policyname,true), Constant(' cs2='), Field(fld5,true), Constant(' cs4='), Field(severity,true), Constant(' cs5='), Field(fld8,true), Constant(' act='), Field(action,false)}"
match("MESSAGE#128:AF_400_RESP", "nwparser.payload", "%{product}|%{version}|%{rule}|%{fld1}|%{severity}|src=%{saddr->} spt=%{sport->} method=%{web_method->} request=%{url->} msg=%{info->} cn1=%{fld2->} cn2=%{fld3->} cs1=%{policyname->} cs2=%{fld5->} cs4=%{severity->} cs5=%{fld8->} act=%{action}", processor_chain([
	dup11,
	dup91,
]));

var dup111 = // "Pattern{Field(info,false)}"
match_copy("MESSAGE#165:AAATM_Message:06", "nwparser.payload", "info", processor_chain([
	dup9,
	dup4,
]));

var dup112 = linear_select([
	dup95,
	dup96,
]);

var dup113 = all_match({
	processors: [
		dup20,
		dup98,
		dup23,
	],
	on_success: processor_chain([
		dup2,
		dup24,
		dup3,
		dup4,
	]),
});

var dup114 = all_match({
	processors: [
		dup94,
		dup112,
		dup97,
	],
	on_success: processor_chain([
		dup9,
		dup4,
	]),
});

var hdr1 = // "Pattern{Field(hdatetime,true), Constant(' '), Field(hfld1,true), Constant(' : '), Field(msgIdPart1,true), Constant(' '), Field(msgIdPart2,true), Constant(' '), Field(hfld2,false), Constant(':'), Field(payload,false)}"
match("HEADER#0:0001", "message", "%{hdatetime->} %{hfld1->} : %{msgIdPart1->} %{msgIdPart2->} %{hfld2}:%{payload}", processor_chain([
	setc("header_id","0001"),
	dup1,
]));

var hdr2 = // "Pattern{Field(hdatetime,true), Constant(' '), Field(hfld1,true), Constant(' : '), Field(msgIdPart1,true), Constant(' '), Field(msgIdPart2,true), Constant(' :'), Field(payload,false)}"
match("HEADER#1:0005", "message", "%{hdatetime->} %{hfld1->} : %{msgIdPart1->} %{msgIdPart2->} :%{payload}", processor_chain([
	setc("header_id","0005"),
	dup1,
]));

var hdr3 = // "Pattern{Field(hdatetime,true), Constant(' '), Field(hfld1,true), Constant(' : '), Field(hfld2,true), Constant(' '), Field(msgIdPart1,true), Constant(' '), Field(msgIdPart2,true), Constant(' '), Field(p0,false)}"
match("HEADER#2:0002/0", "message", "%{hdatetime->} %{hfld1->} : %{hfld2->} %{msgIdPart1->} %{msgIdPart2->} %{p0}");

var part1 = // "Pattern{Field(hfld3,true), Constant(' '), Field(p0,false)}"
match("HEADER#2:0002/1_0", "nwparser.p0", "%{hfld3->} %{p0}");

var part2 = // "Pattern{Field(p0,false)}"
match_copy("HEADER#2:0002/1_1", "nwparser.p0", "p0");

var select1 = linear_select([
	part1,
	part2,
]);

var part3 = // "Pattern{Constant(':'), Field(payload,false)}"
match("HEADER#2:0002/2", "nwparser.p0", ":%{payload}");

var all1 = all_match({
	processors: [
		hdr3,
		select1,
		part3,
	],
	on_success: processor_chain([
		setc("header_id","0002"),
		dup1,
	]),
});

var hdr4 = // "Pattern{Field(messageid,true), Constant(' '), Field(p0,false)}"
match("HEADER#3:0003", "message", "%{messageid->} %{p0}", processor_chain([
	setc("header_id","0003"),
	call({
		dest: "nwparser.payload",
		fn: STRCAT,
		args: [
			field("messageid"),
			constant(" "),
			field("p0"),
		],
	}),
]));

var hdr5 = // "Pattern{Constant('CEF:0|Citrix|'), Field(fld1,false), Constant('|'), Field(fld2,false), Constant('|'), Field(fld3,false), Constant('|'), Field(messageid,false), Constant('| '), Field(p0,false)}"
match("HEADER#4:0004", "message", "CEF:0|Citrix|%{fld1}|%{fld2}|%{fld3}|%{messageid}| %{p0}", processor_chain([
	setc("header_id","0004"),
	call({
		dest: "nwparser.payload",
		fn: STRCAT,
		args: [
			field("fld1"),
			constant("|"),
			field("fld2"),
			constant("|"),
			field("fld3"),
			constant("|"),
			field("messageid"),
			constant("| "),
			field("p0"),
		],
	}),
]));

var hdr6 = // "Pattern{Constant('CEF:0|Citrix|'), Field(product,false), Constant('|'), Field(version,false), Constant('|'), Field(rule,false), Constant('|'), Field(hfld1,false), Constant('|'), Field(severity,false), Constant('| '), Field(payload,false)}"
match("HEADER#5:0006", "message", "CEF:0|Citrix|%{product}|%{version}|%{rule}|%{hfld1}|%{severity}| %{payload}", processor_chain([
	setc("header_id","0006"),
	setc("messageid","CITRIX_TVM"),
]));

var select2 = linear_select([
	hdr1,
	hdr2,
	all1,
	hdr4,
	hdr5,
	hdr6,
]);

var part4 = // "Pattern{Constant('Extracted_groups "'), Field(group,false), Constant('" ')}"
match("MESSAGE#0:AAA_EXTRACTED_GROUPS/0_0", "nwparser.payload", "Extracted_groups \"%{group}\" ");

var part5 = // "Pattern{Constant(' Extracted_groups "'), Field(group,false)}"
match("MESSAGE#0:AAA_EXTRACTED_GROUPS/0_1", "nwparser.payload", " Extracted_groups \"%{group}");

var select3 = linear_select([
	part4,
	part5,
]);

var all2 = all_match({
	processors: [
		select3,
	],
	on_success: processor_chain([
		dup2,
		setc("event_description","The groups extracted after user logs in"),
		dup3,
		dup4,
	]),
});

var msg1 = msg("AAA_EXTRACTED_GROUPS", all2);

var part6 = // "Pattern{Constant('User '), Field(username,true), Constant(' - Client_ip '), Field(saddr,true), Constant(' - Failure_reason "'), Field(result,false), Constant('"')}"
match("MESSAGE#1:AAA_LOGIN_FAILED", "nwparser.payload", "User %{username->} - Client_ip %{saddr->} - Failure_reason \"%{result}\"", processor_chain([
	dup5,
	setc("ec_subject","User"),
	dup6,
	dup7,
	dup8,
	setc("event_description","The aaa module failed to login the user"),
	setc("severity","Alert"),
	dup4,
]));

var msg2 = msg("AAA_LOGIN_FAILED", part6);

var part7 = // "Pattern{Constant('Source '), Field(saddr,false), Constant(':'), Field(sport,true), Constant(' --> Destination '), Field(daddr,false), Constant(':'), Field(dport,true), Constant(' - Protocol '), Field(protocol,true), Constant(' - TimeStamp '), Field(info,true), Constant(' - Hitcount '), Field(dclass_counter1,true), Constant(' - Hit Rule '), Field(rulename,true), Constant(' - Data '), Field(message_body,false)}"
match("MESSAGE#2:ACL_ACL_PKT_LOG", "nwparser.payload", "Source %{saddr}:%{sport->} --> Destination %{daddr}:%{dport->} - Protocol %{protocol->} - TimeStamp %{info->} - Hitcount %{dclass_counter1->} - Hit Rule %{rulename->} - Data %{message_body}", processor_chain([
	dup9,
	setc("event_description","ACL_PKT_LOG"),
	dup10,
	dup4,
]));

var msg3 = msg("ACL_ACL_PKT_LOG", part7);

var part8 = // "Pattern{Field(saddr,true), Constant(' '), Field(fld2,true), Constant(' '), Field(rule_group,true), Constant(' '), Field(info,false), Constant(': '), Field(url,true), Constant(' <<'), Field(disposition,false), Constant('>')}"
match("MESSAGE#3:APPFW_APPFW_BUFFEROVERFLOW_COOKIE", "nwparser.payload", "%{saddr->} %{fld2->} %{rule_group->} %{info}: %{url->} \u003c\u003c%{disposition}>", processor_chain([
	dup11,
	setc("event_description","AppFw Buffer Overflow violation in Cookie"),
	dup3,
	dup4,
]));

var msg4 = msg("APPFW_APPFW_BUFFEROVERFLOW_COOKIE", part8);

var part9 = // "Pattern{Field(saddr,true), Constant(' '), Field(fld2,true), Constant(' '), Field(rule_group,true), Constant(' '), Field(info,false), Constant(': '), Field(url,true), Constant(' <<'), Field(disposition,false), Constant('>')}"
match("MESSAGE#4:APPFW_APPFW_BUFFEROVERFLOW_HDR", "nwparser.payload", "%{saddr->} %{fld2->} %{rule_group->} %{info}: %{url->} \u003c\u003c%{disposition}>", processor_chain([
	dup11,
	setc("event_description","AppFw Buffer Overflow violation in HTTP Headers"),
	dup3,
	dup4,
]));

var msg5 = msg("APPFW_APPFW_BUFFEROVERFLOW_HDR", part9);

var part10 = // "Pattern{Field(saddr,true), Constant(' '), Field(fld2,true), Constant(' '), Field(rule_group,true), Constant(' '), Field(info,false), Constant(': '), Field(url,true), Constant(' <<'), Field(disposition,false), Constant('>')}"
match("MESSAGE#5:APPFW_APPFW_BUFFEROVERFLOW_URL", "nwparser.payload", "%{saddr->} %{fld2->} %{rule_group->} %{info}: %{url->} \u003c\u003c%{disposition}>", processor_chain([
	dup12,
	dup13,
	dup3,
	dup4,
]));

var msg6 = msg("APPFW_APPFW_BUFFEROVERFLOW_URL", part10);

var part11 = // "Pattern{Field(saddr,true), Constant(' '), Field(fld2,true), Constant(' '), Field(info,false), Constant(': '), Field(url,false)}"
match("MESSAGE#137:APPFW_APPFW_BUFFEROVERFLOW_URL:01", "nwparser.payload", "%{saddr->} %{fld2->} %{info}: %{url}", processor_chain([
	dup12,
	dup13,
	dup3,
	dup4,
]));

var msg7 = msg("APPFW_APPFW_BUFFEROVERFLOW_URL:01", part11);

var select4 = linear_select([
	msg6,
	msg7,
]);

var part12 = // "Pattern{Field(fld2,true), Constant(' '), Field(fld3,true), Constant(' '), Field(rule_group,true), Constant(' Cookie'), Field(p0,false)}"
match("MESSAGE#6:APPFW_APPFW_COOKIE/1_0", "nwparser.p0", "%{fld2->} %{fld3->} %{rule_group->} Cookie%{p0}");

var part13 = // "Pattern{Field(fld2,true), Constant(' '), Field(rule_group,true), Constant(' Cookie'), Field(p0,false)}"
match("MESSAGE#6:APPFW_APPFW_COOKIE/1_1", "nwparser.p0", "%{fld2->} %{rule_group->} Cookie%{p0}");

var part14 = // "Pattern{Field(rule_group,true), Constant(' Cookie'), Field(p0,false)}"
match("MESSAGE#6:APPFW_APPFW_COOKIE/1_2", "nwparser.p0", "%{rule_group->} Cookie%{p0}");

var select5 = linear_select([
	part12,
	part13,
	part14,
]);

var part15 = // "Pattern{Field(url,true), Constant(' validation failed for '), Field(fld3,true), Constant(' <<'), Field(disposition,false), Constant('>')}"
match("MESSAGE#6:APPFW_APPFW_COOKIE/2", "nwparser.p0", "%{url->} validation failed for %{fld3->} \u003c\u003c%{disposition}>");

var all3 = all_match({
	processors: [
		dup14,
		select5,
		part15,
	],
	on_success: processor_chain([
		dup11,
		setc("event_description","AppFw Cookie violation"),
		dup3,
		dup4,
	]),
});

var msg8 = msg("APPFW_APPFW_COOKIE", all3);

var part16 = // "Pattern{Field(fld2,true), Constant(' '), Field(rule_group,true), Constant(' Disallow Deny URL: '), Field(p0,false)}"
match("MESSAGE#7:APPFW_APPFW_DENYURL/1_0", "nwparser.p0", "%{fld2->} %{rule_group->} Disallow Deny URL: %{p0}");

var part17 = // "Pattern{Field(rule_group,true), Constant(' Disallow Deny URL: '), Field(p0,false)}"
match("MESSAGE#7:APPFW_APPFW_DENYURL/1_1", "nwparser.p0", "%{rule_group->} Disallow Deny URL: %{p0}");

var select6 = linear_select([
	part16,
	part17,
]);

var all4 = all_match({
	processors: [
		dup14,
		select6,
		dup15,
	],
	on_success: processor_chain([
		dup12,
		setc("ec_activity","Deny"),
		setc("ec_theme","Policy"),
		setc("event_description","AppFw DenyURL violation"),
		dup3,
		dup4,
	]),
});

var msg9 = msg("APPFW_APPFW_DENYURL", all4);

var part18 = // "Pattern{Field(fld1,true), Constant(' '), Field(fld2,true), Constant(' '), Field(rule_group,true), Constant(' Field consistency'), Field(p0,false)}"
match("MESSAGE#8:APPFW_APPFW_FIELDCONSISTENCY/1_0", "nwparser.p0", "%{fld1->} %{fld2->} %{rule_group->} Field consistency%{p0}");

var part19 = // "Pattern{Field(fld2,true), Constant(' '), Field(rule_group,true), Constant(' Field consistency'), Field(p0,false)}"
match("MESSAGE#8:APPFW_APPFW_FIELDCONSISTENCY/1_1", "nwparser.p0", "%{fld2->} %{rule_group->} Field consistency%{p0}");

var part20 = // "Pattern{Field(rule_group,true), Constant(' Field consistency'), Field(p0,false)}"
match("MESSAGE#8:APPFW_APPFW_FIELDCONSISTENCY/1_2", "nwparser.p0", "%{rule_group->} Field consistency%{p0}");

var select7 = linear_select([
	part18,
	part19,
	part20,
]);

var all5 = all_match({
	processors: [
		dup14,
		select7,
		dup16,
	],
	on_success: processor_chain([
		dup11,
		setc("event_description","AppFw Field Consistency violation"),
		dup3,
		dup4,
	]),
});

var msg10 = msg("APPFW_APPFW_FIELDCONSISTENCY", all5);

var part21 = // "Pattern{Field(fld2,true), Constant(' '), Field(rule_group,true), Constant(' Field'), Field(p0,false)}"
match("MESSAGE#9:APPFW_APPFW_FIELDFORMAT/1_0", "nwparser.p0", "%{fld2->} %{rule_group->} Field%{p0}");

var part22 = // "Pattern{Field(rule_group,true), Constant(' Field'), Field(p0,false)}"
match("MESSAGE#9:APPFW_APPFW_FIELDFORMAT/1_1", "nwparser.p0", "%{rule_group->} Field%{p0}");

var select8 = linear_select([
	part21,
	part22,
]);

var part23 = // "Pattern{Field(url,true), Constant(' '), Field(info,true), Constant(' ="'), Field(fld4,false), Constant('" <<'), Field(disposition,false), Constant('>')}"
match("MESSAGE#9:APPFW_APPFW_FIELDFORMAT/2", "nwparser.p0", "%{url->} %{info->} =\"%{fld4}\" \u003c\u003c%{disposition}>");

var all6 = all_match({
	processors: [
		dup14,
		select8,
		part23,
	],
	on_success: processor_chain([
		dup11,
		setc("event_description","AppFw Field Format violation"),
		dup3,
		dup4,
	]),
});

var msg11 = msg("APPFW_APPFW_FIELDFORMAT", all6);

var part24 = // "Pattern{Field(fld2,true), Constant(' '), Field(rule_group,true), Constant(' SQL'), Field(p0,false)}"
match("MESSAGE#10:APPFW_APPFW_SQL/1_0", "nwparser.p0", "%{fld2->} %{rule_group->} SQL%{p0}");

var part25 = // "Pattern{Field(rule_group,true), Constant(' SQL'), Field(p0,false)}"
match("MESSAGE#10:APPFW_APPFW_SQL/1_1", "nwparser.p0", "%{rule_group->} SQL%{p0}");

var select9 = linear_select([
	part24,
	part25,
]);

var all7 = all_match({
	processors: [
		dup14,
		select9,
		dup16,
	],
	on_success: processor_chain([
		dup11,
		dup17,
		dup3,
		dup4,
	]),
});

var msg12 = msg("APPFW_APPFW_SQL", all7);

var part26 = // "Pattern{Field(fld2,true), Constant(' '), Field(rule_group,true), Constant(' '), Field(p0,false)}"
match("MESSAGE#11:APPFW_APPFW_SQL_1/1_0", "nwparser.p0", "%{fld2->} %{rule_group->} %{p0}");

var part27 = // "Pattern{Field(rule_group,true), Constant(' '), Field(p0,false)}"
match("MESSAGE#11:APPFW_APPFW_SQL_1/1_1", "nwparser.p0", "%{rule_group->} %{p0}");

var select10 = linear_select([
	part26,
	part27,
]);

var all8 = all_match({
	processors: [
		dup14,
		select10,
		dup16,
	],
	on_success: processor_chain([
		dup11,
		dup17,
		dup3,
		dup4,
	]),
});

var msg13 = msg("APPFW_APPFW_SQL_1", all8);

var select11 = linear_select([
	msg12,
	msg13,
]);

var part28 = // "Pattern{Field(fld2,true), Constant(' '), Field(rule_group,true), Constant(' Maximum no. '), Field(p0,false)}"
match("MESSAGE#12:APPFW_APPFW_SAFECOMMERCE/1_0", "nwparser.p0", "%{fld2->} %{rule_group->} Maximum no. %{p0}");

var part29 = // "Pattern{Field(rule_group,true), Constant(' Maximum no. '), Field(p0,false)}"
match("MESSAGE#12:APPFW_APPFW_SAFECOMMERCE/1_1", "nwparser.p0", "%{rule_group->} Maximum no. %{p0}");

var select12 = linear_select([
	part28,
	part29,
]);

var part30 = // "Pattern{Field(url,true), Constant(' of potential credit card numbers seen <<'), Field(info,false), Constant('>')}"
match("MESSAGE#12:APPFW_APPFW_SAFECOMMERCE/2", "nwparser.p0", "%{url->} of potential credit card numbers seen \u003c\u003c%{info}>");

var all9 = all_match({
	processors: [
		dup14,
		select12,
		part30,
	],
	on_success: processor_chain([
		dup9,
		setc("event_description","AppFw SafeCommerce credit cards seen"),
		dup3,
		dup4,
	]),
});

var msg14 = msg("APPFW_APPFW_SAFECOMMERCE", all9);

var part31 = // "Pattern{Field(fld2,true), Constant(' '), Field(rule_group,true), Constant(' '), Field(url,true), Constant(' Transformed ('), Field(info,false), Constant(') Maximum no. '), Field(p0,false)}"
match("MESSAGE#13:APPFW_APPFW_SAFECOMMERCE_XFORM/1_0", "nwparser.p0", "%{fld2->} %{rule_group->} %{url->} Transformed (%{info}) Maximum no. %{p0}");

var part32 = // "Pattern{Field(rule_group,true), Constant(' '), Field(url,true), Constant(' ('), Field(info,false), Constant(') '), Field(p0,false)}"
match("MESSAGE#13:APPFW_APPFW_SAFECOMMERCE_XFORM/1_1", "nwparser.p0", "%{rule_group->} %{url->} (%{info}) %{p0}");

var select13 = linear_select([
	part31,
	part32,
]);

var part33 = // "Pattern{Constant('potential credit card numbers seen in server response'), Field(,false)}"
match("MESSAGE#13:APPFW_APPFW_SAFECOMMERCE_XFORM/2", "nwparser.p0", "potential credit card numbers seen in server response%{}");

var all10 = all_match({
	processors: [
		dup14,
		select13,
		part33,
	],
	on_success: processor_chain([
		dup9,
		setc("event_description","AppFw SafeCommerce Transformed for credit cards seen in server repsonse"),
		dup3,
		dup4,
	]),
});

var msg15 = msg("APPFW_APPFW_SAFECOMMERCE_XFORM", all10);

var part34 = // "Pattern{Field(fld2,true), Constant(' '), Field(fld3,true), Constant(' '), Field(rule_group,true), Constant(' Disallow Illegal URL: '), Field(p0,false)}"
match("MESSAGE#14:APPFW_APPFW_STARTURL/1_0", "nwparser.p0", "%{fld2->} %{fld3->} %{rule_group->} Disallow Illegal URL: %{p0}");

var part35 = // "Pattern{Field(fld2,true), Constant(' '), Field(rule_group,true), Constant(' Disallow Illegal URL: '), Field(p0,false)}"
match("MESSAGE#14:APPFW_APPFW_STARTURL/1_1", "nwparser.p0", "%{fld2->} %{rule_group->} Disallow Illegal URL: %{p0}");

var part36 = // "Pattern{Field(rule_group,true), Constant(' Disallow Illegal URL: '), Field(p0,false)}"
match("MESSAGE#14:APPFW_APPFW_STARTURL/1_2", "nwparser.p0", "%{rule_group->} Disallow Illegal URL: %{p0}");

var select14 = linear_select([
	part34,
	part35,
	part36,
]);

var all11 = all_match({
	processors: [
		dup14,
		select14,
		dup15,
	],
	on_success: processor_chain([
		dup12,
		setc("event_description","AppFw StartURL violation"),
		dup3,
		dup4,
	]),
});

var msg16 = msg("APPFW_APPFW_STARTURL", all11);

var part37 = // "Pattern{Field(fld2,true), Constant(' '), Field(rule_group,true), Constant(' Cross-site'), Field(p0,false)}"
match("MESSAGE#15:APPFW_APPFW_XSS/1_0", "nwparser.p0", "%{fld2->} %{rule_group->} Cross-site%{p0}");

var part38 = // "Pattern{Field(rule_group,true), Constant(' Cross-site'), Field(p0,false)}"
match("MESSAGE#15:APPFW_APPFW_XSS/1_1", "nwparser.p0", "%{rule_group->} Cross-site%{p0}");

var select15 = linear_select([
	part37,
	part38,
]);

var part39 = // "Pattern{Field(url,true), Constant(' script '), Field(info,true), Constant(' <<'), Field(disposition,false), Constant('>')}"
match("MESSAGE#15:APPFW_APPFW_XSS/2", "nwparser.p0", "%{url->} script %{info->} \u003c\u003c%{disposition}>");

var all12 = all_match({
	processors: [
		dup14,
		select15,
		part39,
	],
	on_success: processor_chain([
		dup12,
		setc("event_description","AppFw XSS violation"),
		dup3,
		dup4,
	]),
});

var msg17 = msg("APPFW_APPFW_XSS", all12);

var part40 = // "Pattern{Field(saddr,true), Constant(' "'), Field(info,false), Constant('"')}"
match("MESSAGE#16:APPFW_AF_400_RESP", "nwparser.payload", "%{saddr->} \"%{info}\"", processor_chain([
	dup11,
	dup18,
	dup3,
	dup4,
]));

var msg18 = msg("APPFW_AF_400_RESP", part40);

var part41 = // "Pattern{Field(saddr,true), Constant(' '), Field(info,false)}"
match("MESSAGE#138:APPFW_AF_400_RESP:01", "nwparser.payload", "%{saddr->} %{info}", processor_chain([
	dup11,
	dup18,
	dup3,
	dup4,
]));

var msg19 = msg("APPFW_AF_400_RESP:01", part41);

var select16 = linear_select([
	msg18,
	msg19,
]);

var part42 = // "Pattern{Field(saddr,true), Constant(' '), Field(fld10,true), Constant(' Match found with Safe Object: '), Field(info,true), Constant(' <<'), Field(disposition,false), Constant('>')}"
match("MESSAGE#17:APPFW_APPFW_SAFEOBJECT", "nwparser.payload", "%{saddr->} %{fld10->} Match found with Safe Object: %{info->} \u003c\u003c%{disposition}>", processor_chain([
	dup11,
	setc("event_description","AppFw Safe Object"),
	dup3,
	dup4,
]));

var msg20 = msg("APPFW_APPFW_SAFEOBJECT", part42);

var part43 = // "Pattern{Field(saddr,true), Constant(' '), Field(fld10,true), Constant(' CSRF Tag validation failed: <<'), Field(disposition,false), Constant('>')}"
match("MESSAGE#18:APPFW_APPFW_CSRF_TAG", "nwparser.payload", "%{saddr->} %{fld10->} CSRF Tag validation failed: \u003c\u003c%{disposition}>", processor_chain([
	dup11,
	setc("event_description","AppFw CSRF Tag Validation Failed"),
	dup3,
	dup4,
]));

var msg21 = msg("APPFW_APPFW_CSRF_TAG", part43);

var part44 = // "Pattern{Field(saddr,true), Constant(' '), Field(fld1,true), Constant(' '), Field(fld2,true), Constant(' '), Field(fld3,true), Constant(' '), Field(url,false)}"
match("MESSAGE#135:APPFW_APPFW_CSRF_TAG:01", "nwparser.payload", "%{saddr->} %{fld1->} %{fld2->} %{fld3->} %{url}", processor_chain([
	dup9,
	dup3,
	dup4,
]));

var msg22 = msg("APPFW_APPFW_CSRF_TAG:01", part44);

var select17 = linear_select([
	msg21,
	msg22,
]);

var part45 = // "Pattern{Constant('Memory allocation request for '), Field(bytes,true), Constant(' bytes failed. Call stack PCs: '), Field(fld1,false)}"
match("MESSAGE#19:APPFW_AF_MEMORY_ERR", "nwparser.payload", "Memory allocation request for %{bytes->} bytes failed. Call stack PCs: %{fld1}", processor_chain([
	dup11,
	setc("event_description","Memory allocation request for some bytes failed"),
	dup19,
	dup4,
]));

var msg23 = msg("APPFW_AF_MEMORY_ERR", part45);

var part46 = // "Pattern{Constant('Invalid rule id '), Field(p0,false)}"
match("MESSAGE#20:APPFW_Message/1_0", "nwparser.p0", "Invalid rule id %{p0}");

var part47 = // "Pattern{Constant('Duplicate rule id '), Field(p0,false)}"
match("MESSAGE#20:APPFW_Message/1_1", "nwparser.p0", "Duplicate rule id %{p0}");

var select18 = linear_select([
	part46,
	part47,
]);

var part48 = // "Pattern{Field(fld1,false), Constant('"')}"
match("MESSAGE#20:APPFW_Message/2", "nwparser.p0", "%{fld1}\"");

var all13 = all_match({
	processors: [
		dup20,
		select18,
		part48,
	],
	on_success: processor_chain([
		dup11,
		setc("event_description","Invalid/Duplicate Rule id"),
		dup19,
		dup4,
	]),
});

var msg24 = msg("APPFW_Message", all13);

var part49 = // "Pattern{Constant('"Setting default custom settings for profile '), Field(fld1,true), Constant(' ('), Field(fld2,false), Constant(')"')}"
match("MESSAGE#21:APPFW_Message:01", "nwparser.payload", "\"Setting default custom settings for profile %{fld1->} (%{fld2})\"", processor_chain([
	dup9,
	setc("event_description","Setting default custom settings for profile"),
	dup19,
	dup4,
]));

var msg25 = msg("APPFW_Message:01", part49);

var part50 = // "Pattern{Constant('"Setting same CustomSettings( ) to profile. '), Field(fld2,false), Constant('"')}"
match("MESSAGE#22:APPFW_Message:02", "nwparser.payload", "\"Setting same CustomSettings( ) to profile. %{fld2}\"", processor_chain([
	dup9,
	setc("event_description","Setting same CustomSettings( ) to profile."),
	dup4,
]));

var msg26 = msg("APPFW_Message:02", part50);

var select19 = linear_select([
	msg24,
	msg25,
	msg26,
]);

var msg27 = msg("DR_HA_Message", dup113);

var part51 = // "Pattern{Field(process,true), Constant(' ended '), Field(p0,false)}"
match("MESSAGE#24:EVENT_ALERTENDED/0", "nwparser.payload", "%{process->} ended %{p0}");

var all14 = all_match({
	processors: [
		part51,
		dup99,
	],
	on_success: processor_chain([
		dup2,
		setc("event_description","Alert process ended"),
		dup3,
		dup4,
	]),
});

var msg28 = msg("EVENT_ALERTENDED", all14);

var part52 = // "Pattern{Field(process,true), Constant(' started '), Field(p0,false)}"
match("MESSAGE#25:EVENT_ALERTSTARTED/0", "nwparser.payload", "%{process->} started %{p0}");

var all15 = all_match({
	processors: [
		part52,
		dup99,
	],
	on_success: processor_chain([
		dup2,
		setc("event_description","Alert process started"),
		dup3,
		dup4,
	]),
});

var msg29 = msg("EVENT_ALERTSTARTED", all15);

var part53 = // "Pattern{Constant('CONFIG '), Field(info,false)}"
match("MESSAGE#26:EVENT_CONFIGEND", "nwparser.payload", "CONFIG %{info}", processor_chain([
	dup2,
	dup27,
	dup28,
	dup29,
	setc("event_description","Configuration read completed from ns.conf file during boot-up"),
	dup3,
	dup4,
]));

var msg30 = msg("EVENT_CONFIGEND", part53);

var part54 = // "Pattern{Constant('CONFIG '), Field(info,false)}"
match("MESSAGE#27:EVENT_CONFIGSTART", "nwparser.payload", "CONFIG %{info}", processor_chain([
	dup2,
	dup27,
	dup30,
	dup29,
	setc("event_description","Configuration read started from ns.conf file during boot-up"),
	dup3,
	dup4,
]));

var msg31 = msg("EVENT_CONFIGSTART", part54);

var all16 = all_match({
	processors: [
		dup31,
		dup100,
	],
	on_success: processor_chain([
		dup11,
		dup34,
		dup28,
		setc("event_description","Device Down"),
		dup10,
		dup35,
	]),
});

var msg32 = msg("EVENT_DEVICEDOWN", all16);

var part55 = // "Pattern{Field(obj_type,true), Constant(' "'), Field(obj_name,false), Constant('" - State '), Field(event_state,false)}"
match("MESSAGE#29:EVENT_DEVICEOFS", "nwparser.payload", "%{obj_type->} \"%{obj_name}\" - State %{event_state}", processor_chain([
	dup11,
	dup34,
	dup28,
	setc("event_description","Device Out Of Service"),
	dup10,
	dup4,
]));

var msg33 = msg("EVENT_DEVICEOFS", part55);

var all17 = all_match({
	processors: [
		dup31,
		dup100,
	],
	on_success: processor_chain([
		dup2,
		dup34,
		dup30,
		setc("event_description","Device UP"),
		dup10,
		dup35,
	]),
});

var msg34 = msg("EVENT_DEVICEUP", all17);

var part56 = // "Pattern{Constant('"'), Field(obj_name,false), Constant('"')}"
match("MESSAGE#31:EVENT_MONITORDOWN/1_1", "nwparser.p0", "\"%{obj_name}\"");

var select20 = linear_select([
	dup37,
	part56,
	dup38,
]);

var all18 = all_match({
	processors: [
		dup36,
		select20,
	],
	on_success: processor_chain([
		dup11,
		setc("event_description","The monitor bound to the service is down"),
		dup3,
		dup4,
	]),
});

var msg35 = msg("EVENT_MONITORDOWN", all18);

var select21 = linear_select([
	dup37,
	dup38,
]);

var all19 = all_match({
	processors: [
		dup36,
		select21,
	],
	on_success: processor_chain([
		dup2,
		dup39,
		dup3,
		dup4,
	]),
});

var msg36 = msg("EVENT_MONITORUP", all19);

var part57 = // "Pattern{Field(obj_type,true), Constant(' "'), Field(obj_name,false), Constant('" - State '), Field(event_state,false)}"
match("MESSAGE#33:EVENT_NICRESET", "nwparser.payload", "%{obj_type->} \"%{obj_name}\" - State %{event_state}", processor_chain([
	dup2,
	dup39,
	dup3,
	dup4,
]));

var msg37 = msg("EVENT_NICRESET", part57);

var part58 = // "Pattern{Field(obj_type,true), Constant(' '), Field(obj_name,true), Constant(' - State '), Field(event_state,false)}"
match("MESSAGE#34:EVENT_ROUTEDOWN", "nwparser.payload", "%{obj_type->} %{obj_name->} - State %{event_state}", processor_chain([
	dup11,
	dup40,
	dup28,
	setc("event_description","Route is Down"),
	dup3,
	dup4,
]));

var msg38 = msg("EVENT_ROUTEDOWN", part58);

var part59 = // "Pattern{Field(obj_type,true), Constant(' '), Field(obj_name,true), Constant(' - State '), Field(event_state,false)}"
match("MESSAGE#35:EVENT_ROUTEUP", "nwparser.payload", "%{obj_type->} %{obj_name->} - State %{event_state}", processor_chain([
	dup2,
	dup40,
	dup30,
	setc("event_description","Route is UP"),
	dup41,
	dup4,
]));

var msg39 = msg("EVENT_ROUTEUP", part59);

var part60 = // "Pattern{Constant('CPU_started '), Field(info,false)}"
match("MESSAGE#36:EVENT_STARTCPU", "nwparser.payload", "CPU_started %{info}", processor_chain([
	dup2,
	setc("event_description","CPU Started"),
	dup3,
	dup4,
]));

var msg40 = msg("EVENT_STARTCPU", part60);

var part61 = // "Pattern{Constant('SAVECONFIG '), Field(info,false)}"
match("MESSAGE#37:EVENT_STARTSAVECONFIG", "nwparser.payload", "SAVECONFIG %{info}", processor_chain([
	dup2,
	setc("event_description","Save configuration started"),
	dup3,
	dup4,
]));

var msg41 = msg("EVENT_STARTSAVECONFIG", part61);

var part62 = // "Pattern{Constant('System started - '), Field(info,false)}"
match("MESSAGE#38:EVENT_STARTSYS", "nwparser.payload", "System started - %{info}", processor_chain([
	dup2,
	dup34,
	dup30,
	setc("event_description","Netscaler Started"),
	dup3,
	dup4,
]));

var msg42 = msg("EVENT_STARTSYS", part62);

var part63 = // "Pattern{Field(obj_type,true), Constant(' "'), Field(obj_name,false), Constant('" - State '), Field(event_state,false)}"
match("MESSAGE#39:EVENT_STATECHANGE", "nwparser.payload", "%{obj_type->} \"%{obj_name}\" - State %{event_state}", processor_chain([
	dup2,
	dup34,
	dup30,
	setc("event_description","HA State has changed"),
	dup3,
	dup4,
]));

var msg43 = msg("EVENT_STATECHANGE", part63);

var part64 = // "Pattern{Field(obj_type,true), Constant(' ('), Field(obj_name,false), Constant(') - '), Field(event_state,true), Constant(' '), Field(info,false)}"
match("MESSAGE#40:EVENT_STATECHANGE_HEARTBEAT", "nwparser.payload", "%{obj_type->} (%{obj_name}) - %{event_state->} %{info}", processor_chain([
	dup2,
	setc("event_description","Heartbeat State report"),
	dup3,
	dup4,
]));

var msg44 = msg("EVENT_STATECHANGE_HEARTBEAT", part64);

var part65 = // "Pattern{Field(obj_type,true), Constant(' "'), Field(obj_name,false), Constant('" - '), Field(event_state,true), Constant(' '), Field(info,false)}"
match("MESSAGE#41:EVENT_STATECHANGE:01", "nwparser.payload", "%{obj_type->} \"%{obj_name}\" - %{event_state->} %{info}", processor_chain([
	dup2,
	dup4,
]));

var msg45 = msg("EVENT_STATECHANGE:01", part65);

var select22 = linear_select([
	msg43,
	msg44,
	msg45,
]);

var part66 = // "Pattern{Constant('SAVECONFIG'), Field(info,false)}"
match("MESSAGE#42:EVENT_STOPSAVECONFIG", "nwparser.payload", "SAVECONFIG%{info}", processor_chain([
	dup2,
	dup27,
	dup28,
	setc("event_description","Save configuration stopped"),
	dup3,
	dup4,
]));

var msg46 = msg("EVENT_STOPSAVECONFIG", part66);

var part67 = // "Pattern{Constant('System stopped - '), Field(info,false)}"
match("MESSAGE#43:EVENT_STOPSYS", "nwparser.payload", "System stopped - %{info}", processor_chain([
	dup2,
	dup34,
	dup28,
	setc("event_description","Netscaler Stopped"),
	dup3,
	dup4,
]));

var msg47 = msg("EVENT_STOPSYS", part67);

var part68 = // "Pattern{Field(info,false)}"
match_copy("MESSAGE#44:EVENT_UNKNOWN", "nwparser.payload", "info", processor_chain([
	dup11,
	setc("event_description","Unknown Event"),
	dup3,
	dup4,
]));

var msg48 = msg("EVENT_UNKNOWN", part68);

var part69 = // "Pattern{Field(fld1,true), Constant(' '), Field(fld10,true), Constant(' Adding '), Field(p0,false)}"
match("MESSAGE#45:PITBOSS_Message1/1_0", "nwparser.p0", "%{fld1->} %{fld10->} Adding %{p0}");

var part70 = // "Pattern{Constant('Adding '), Field(p0,false)}"
match("MESSAGE#45:PITBOSS_Message1/1_1", "nwparser.p0", "Adding %{p0}");

var select23 = linear_select([
	part69,
	part70,
]);

var all20 = all_match({
	processors: [
		dup42,
		select23,
		dup43,
	],
	on_success: processor_chain([
		dup2,
		setc("event_description","Pitboss watch is added"),
		dup3,
		dup4,
	]),
});

var msg49 = msg("PITBOSS_Message1", all20);

var part71 = // "Pattern{Field(fld1,true), Constant(' '), Field(fld10,true), Constant(' Deleting '), Field(p0,false)}"
match("MESSAGE#46:PITBOSS_Message2/1_0", "nwparser.p0", "%{fld1->} %{fld10->} Deleting %{p0}");

var part72 = // "Pattern{Constant('Deleting '), Field(p0,false)}"
match("MESSAGE#46:PITBOSS_Message2/1_1", "nwparser.p0", "Deleting %{p0}");

var select24 = linear_select([
	part71,
	part72,
]);

var all21 = all_match({
	processors: [
		dup42,
		select24,
		dup23,
	],
	on_success: processor_chain([
		dup2,
		setc("event_description","Pitboss watch is deleted"),
		dup3,
		dup4,
	]),
});

var msg50 = msg("PITBOSS_Message2", all21);

var part73 = // "Pattern{Constant('"'), Field(fld1,true), Constant(' '), Field(fld10,true), Constant(' '), Field(p0,false)}"
match("MESSAGE#47:PITBOSS_Message3/0", "nwparser.payload", "\"%{fld1->} %{fld10->} %{p0}");

var part74 = // "Pattern{Constant('Pitboss policy is'), Field(p0,false)}"
match("MESSAGE#47:PITBOSS_Message3/1_0", "nwparser.p0", "Pitboss policy is%{p0}");

var part75 = // "Pattern{Constant('PB_OP_CHANGE_POLICY new policy'), Field(p0,false)}"
match("MESSAGE#47:PITBOSS_Message3/1_1", "nwparser.p0", "PB_OP_CHANGE_POLICY new policy%{p0}");

var part76 = // "Pattern{Constant('pb_op_longer_hb'), Field(p0,false)}"
match("MESSAGE#47:PITBOSS_Message3/1_2", "nwparser.p0", "pb_op_longer_hb%{p0}");

var select25 = linear_select([
	part74,
	part75,
	part76,
]);

var part77 = // "Pattern{Field(,true), Constant(' '), Field(info,false), Constant('"')}"
match("MESSAGE#47:PITBOSS_Message3/2", "nwparser.p0", "%{} %{info}\"");

var all22 = all_match({
	processors: [
		part73,
		select25,
		part77,
	],
	on_success: processor_chain([
		dup2,
		setc("event_description","Pitboss policy"),
		dup3,
		dup4,
		dup44,
	]),
});

var msg51 = msg("PITBOSS_Message3", all22);

var part78 = // "Pattern{Field(fld1,true), Constant(' '), Field(fld10,true), Constant(' process '), Field(p0,false)}"
match("MESSAGE#48:PITBOSS_Message4/1_0", "nwparser.p0", "%{fld1->} %{fld10->} process %{p0}");

var part79 = // "Pattern{Constant('process '), Field(p0,false)}"
match("MESSAGE#48:PITBOSS_Message4/1_1", "nwparser.p0", "process %{p0}");

var select26 = linear_select([
	part78,
	part79,
]);

var all23 = all_match({
	processors: [
		dup42,
		select26,
		dup43,
	],
	on_success: processor_chain([
		dup2,
		dup45,
		dup3,
		dup4,
		dup44,
	]),
});

var msg52 = msg("PITBOSS_Message4", all23);

var part80 = // "Pattern{Field(fld1,true), Constant(' '), Field(fld10,true), Constant(' New '), Field(p0,false)}"
match("MESSAGE#49:PITBOSS_Message5/1_0", "nwparser.p0", "%{fld1->} %{fld10->} New %{p0}");

var part81 = // "Pattern{Constant('New '), Field(p0,false)}"
match("MESSAGE#49:PITBOSS_Message5/1_1", "nwparser.p0", "New %{p0}");

var select27 = linear_select([
	part80,
	part81,
]);

var all24 = all_match({
	processors: [
		dup42,
		select27,
		dup43,
	],
	on_success: processor_chain([
		dup2,
		dup45,
		dup3,
		dup4,
		dup44,
	]),
});

var msg53 = msg("PITBOSS_Message5", all24);

var select28 = linear_select([
	msg49,
	msg50,
	msg51,
	msg52,
	msg53,
]);

var part82 = // "Pattern{Constant('"IMI: '), Field(event_description,true), Constant(' : nodeID('), Field(fld1,false), Constant(') IP('), Field(saddr,false), Constant(') instance('), Field(fld2,false), Constant(') Configuration Coordinator('), Field(fld3,false), Constant(') Nodeset('), Field(fld4,false), Constant(')"')}"
match("MESSAGE#50:ROUTING_Message", "nwparser.payload", "\"IMI: %{event_description->} : nodeID(%{fld1}) IP(%{saddr}) instance(%{fld2}) Configuration Coordinator(%{fld3}) Nodeset(%{fld4})\"", processor_chain([
	dup9,
	dup4,
]));

var msg54 = msg("ROUTING_Message", part82);

var msg55 = msg("ROUTING_Message:01", dup113);

var part83 = // "Pattern{Constant('"'), Field(fld1,true), Constant(' started"')}"
match("MESSAGE#52:ROUTING_Message:02", "nwparser.payload", "\"%{fld1->} started\"", processor_chain([
	dup9,
	dup4,
]));

var msg56 = msg("ROUTING_Message:02", part83);

var select29 = linear_select([
	msg54,
	msg55,
	msg56,
]);

var part84 = // "Pattern{Field(obj_type,true), Constant(' Command "'), Field(action,false), Constant('" '), Field(info,false)}"
match("MESSAGE#53:ROUTING_ZEBOS_CMD_EXECUTED", "nwparser.payload", "%{obj_type->} Command \"%{action}\" %{info}", processor_chain([
	dup2,
	setc("event_description","User has executed a command in ZebOS(vtysh)"),
	dup3,
	dup4,
]));

var msg57 = msg("ROUTING_ZEBOS_CMD_EXECUTED", part84);

var part85 = // "Pattern{Field(obj_type,true), Constant(' ( '), Field(space,false), Constant('entityName = "'), Field(p0,false)}"
match("MESSAGE#54:SNMP_TRAP_SENT7/0", "nwparser.payload", "%{obj_type->} ( %{space}entityName = \"%{p0}");

var part86 = // "Pattern{Field(obj_name,false), Constant('('), Field(info,false), Constant('...",'), Field(p0,false)}"
match("MESSAGE#54:SNMP_TRAP_SENT7/1_0", "nwparser.p0", "%{obj_name}(%{info}...\",%{p0}");

var part87 = // "Pattern{Field(obj_name,false), Constant('...",'), Field(p0,false)}"
match("MESSAGE#54:SNMP_TRAP_SENT7/1_1", "nwparser.p0", "%{obj_name}...\",%{p0}");

var select30 = linear_select([
	part86,
	part87,
]);

var part88 = // "Pattern{Field(,false), Constant('alarmEntityCurState = '), Field(event_state,false), Constant(', '), Field(p0,false)}"
match("MESSAGE#54:SNMP_TRAP_SENT7/2", "nwparser.p0", "%{}alarmEntityCurState = %{event_state}, %{p0}");

var part89 = // "Pattern{Constant('svcServiceFullName.'), Field(fld2,true), Constant(' = "'), Field(service,false), Constant('", nsPartitionName = '), Field(fld4,false), Constant(')')}"
match("MESSAGE#54:SNMP_TRAP_SENT7/3_0", "nwparser.p0", "svcServiceFullName.%{fld2->} = \"%{service}\", nsPartitionName = %{fld4})");

var part90 = // "Pattern{Constant('vsvrFullName.'), Field(fld3,true), Constant(' = "'), Field(obj_server,false), Constant('", nsPartitionName = '), Field(fld4,false), Constant(')')}"
match("MESSAGE#54:SNMP_TRAP_SENT7/3_1", "nwparser.p0", "vsvrFullName.%{fld3->} = \"%{obj_server}\", nsPartitionName = %{fld4})");

var part91 = // "Pattern{Constant('svcGrpMemberFullName.'), Field(fld6,true), Constant(' = "'), Field(fld7,false), Constant('", nsPartitionName = '), Field(fld4,false), Constant(')')}"
match("MESSAGE#54:SNMP_TRAP_SENT7/3_2", "nwparser.p0", "svcGrpMemberFullName.%{fld6->} = \"%{fld7}\", nsPartitionName = %{fld4})");

var select31 = linear_select([
	part89,
	part90,
	part91,
	dup46,
]);

var all25 = all_match({
	processors: [
		part85,
		select30,
		part88,
		select31,
	],
	on_success: processor_chain([
		dup11,
		dup47,
		dup10,
		dup4,
	]),
});

var msg58 = msg("SNMP_TRAP_SENT7", all25);

var part92 = // "Pattern{Field(obj_type,true), Constant(' ( entityName = "'), Field(obj_name,false), Constant('...", sysIpAddress = '), Field(hostip,false), Constant(')')}"
match("MESSAGE#55:SNMP_TRAP_SENT8", "nwparser.payload", "%{obj_type->} ( entityName = \"%{obj_name}...\", sysIpAddress = %{hostip})", processor_chain([
	dup9,
	dup47,
	dup4,
]));

var msg59 = msg("SNMP_TRAP_SENT8", part92);

var part93 = // "Pattern{Field(obj_type,true), Constant(' ( haNicsMonitorFailed = '), Field(obj_name,false), Constant(', sysIpAddress = '), Field(hostip,false), Constant(')')}"
match("MESSAGE#56:SNMP_TRAP_SENT9", "nwparser.payload", "%{obj_type->} ( haNicsMonitorFailed = %{obj_name}, sysIpAddress = %{hostip})", processor_chain([
	dup9,
	dup47,
	dup4,
]));

var msg60 = msg("SNMP_TRAP_SENT9", part93);

var part94 = // "Pattern{Field(obj_type,true), Constant(' ( '), Field(space,false), Constant('haPeerSystemState = "'), Field(event_state,false), Constant('", sysIpAddress = '), Field(hostip,false), Constant(')')}"
match("MESSAGE#57:SNMP_TRAP_SENT10", "nwparser.payload", "%{obj_type->} ( %{space}haPeerSystemState = \"%{event_state}\", sysIpAddress = %{hostip})", processor_chain([
	dup9,
	dup47,
	dup10,
	dup4,
]));

var msg61 = msg("SNMP_TRAP_SENT10", part94);

var part95 = // "Pattern{Field(obj_type,true), Constant(' ( sysHealthDiskName = "'), Field(obj_name,false), Constant('", sysHealthDiskPerusage = '), Field(fld2,false), Constant(', alarmHighThreshold = '), Field(dclass_counter2,false), Constant(', sysIpAddress = '), Field(hostip,false), Constant(')')}"
match("MESSAGE#58:SNMP_TRAP_SENT11", "nwparser.payload", "%{obj_type->} ( sysHealthDiskName = \"%{obj_name}\", sysHealthDiskPerusage = %{fld2}, alarmHighThreshold = %{dclass_counter2}, sysIpAddress = %{hostip})", processor_chain([
	dup9,
	dup47,
	dup10,
	dup4,
]));

var msg62 = msg("SNMP_TRAP_SENT11", part95);

var part96 = // "Pattern{Field(obj_type,true), Constant(' ( vsvrName = "'), Field(dclass_counter1_string,false), Constant('", vsvrRequestRate = "'), Field(dclass_counter1,false), Constant('", alarmHighThreshold = '), Field(dclass_counter2,false), Constant(', vsvrFullName = "'), Field(fld1,false), Constant('", sysIpAddress = '), Field(hostip,false), Constant(')')}"
match("MESSAGE#59:SNMP_TRAP_SENT12", "nwparser.payload", "%{obj_type->} ( vsvrName = \"%{dclass_counter1_string}\", vsvrRequestRate = \"%{dclass_counter1}\", alarmHighThreshold = %{dclass_counter2}, vsvrFullName = \"%{fld1}\", sysIpAddress = %{hostip})", processor_chain([
	dup9,
	dup47,
	dup10,
	dup4,
]));

var msg63 = msg("SNMP_TRAP_SENT12", part96);

var part97 = // "Pattern{Field(obj_type,true), Constant(' ( monServiceName = "'), Field(fld1,false), Constant('", monitorName = "'), Field(dclass_counter1_string,false), Constant('", responseTimeoutThreshold = '), Field(dclass_counter1,false), Constant(', alarmMonrespto = '), Field(dclass_counter2,false), Constant(', sysIpAddress = '), Field(hostip,false), Constant(')')}"
match("MESSAGE#60:SNMP_TRAP_SENT13", "nwparser.payload", "%{obj_type->} ( monServiceName = \"%{fld1}\", monitorName = \"%{dclass_counter1_string}\", responseTimeoutThreshold = %{dclass_counter1}, alarmMonrespto = %{dclass_counter2}, sysIpAddress = %{hostip})", processor_chain([
	dup9,
	dup47,
	dup10,
	dup4,
]));

var msg64 = msg("SNMP_TRAP_SENT13", part97);

var part98 = // "Pattern{Field(obj_type,true), Constant(' ( sysHealthCounterName = "'), Field(dclass_counter1_string,false), Constant('", sysHealthCounterValue = '), Field(dclass_counter1,false), Constant(', alarmNormalThreshold = '), Field(dclass_counter2,false), Constant(', sysIpAddress = '), Field(hostip,false), Constant(')')}"
match("MESSAGE#61:SNMP_TRAP_SENT14", "nwparser.payload", "%{obj_type->} ( sysHealthCounterName = \"%{dclass_counter1_string}\", sysHealthCounterValue = %{dclass_counter1}, alarmNormalThreshold = %{dclass_counter2}, sysIpAddress = %{hostip})", processor_chain([
	dup9,
	dup47,
	dup10,
	dup4,
]));

var msg65 = msg("SNMP_TRAP_SENT14", part98);

var part99 = // "Pattern{Field(obj_type,true), Constant(' ( sysHealthCounterName = "'), Field(dclass_counter1_string,false), Constant('", sysHealthCounterValue = '), Field(dclass_counter1,false), Constant(', alarmLowThreshold = '), Field(dclass_counter2,false), Constant(', sysIpAddress = '), Field(hostip,false), Constant(')')}"
match("MESSAGE#62:SNMP_TRAP_SENT15", "nwparser.payload", "%{obj_type->} ( sysHealthCounterName = \"%{dclass_counter1_string}\", sysHealthCounterValue = %{dclass_counter1}, alarmLowThreshold = %{dclass_counter2}, sysIpAddress = %{hostip})", processor_chain([
	dup9,
	dup47,
	dup10,
	dup4,
]));

var msg66 = msg("SNMP_TRAP_SENT15", part99);

var part100 = // "Pattern{Field(obj_type,true), Constant(' ( sysHealthCounterName = "'), Field(dclass_counter1_string,false), Constant('", sysHealthCounterValue = '), Field(dclass_counter1,false), Constant(', alarmHighThreshold = '), Field(dclass_counter2,false), Constant(', sysIpAddress = '), Field(hostip,false), Constant(')')}"
match("MESSAGE#63:SNMP_TRAP_SENT16", "nwparser.payload", "%{obj_type->} ( sysHealthCounterName = \"%{dclass_counter1_string}\", sysHealthCounterValue = %{dclass_counter1}, alarmHighThreshold = %{dclass_counter2}, sysIpAddress = %{hostip})", processor_chain([
	dup9,
	dup47,
	dup10,
	dup4,
]));

var msg67 = msg("SNMP_TRAP_SENT16", part100);

var part101 = // "Pattern{Field(obj_type,true), Constant(' ( alarmRateLmtThresholdExceeded = "'), Field(obj_name,false), Constant(': "'), Field(info,false), Constant('...", ipAddressGathered = "'), Field(fld1,false), Constant('", stringComputed = "'), Field(fld2,false), Constant('", sysIpAddress = '), Field(hostip,false), Constant(')')}"
match("MESSAGE#64:SNMP_TRAP_SENT17", "nwparser.payload", "%{obj_type->} ( alarmRateLmtThresholdExceeded = \"%{obj_name}: \"%{info}...\", ipAddressGathered = \"%{fld1}\", stringComputed = \"%{fld2}\", sysIpAddress = %{hostip})", processor_chain([
	dup9,
	dup47,
	dup10,
	dup4,
]));

var msg68 = msg("SNMP_TRAP_SENT17", part101);

var part102 = // "Pattern{Field(obj_type,true), Constant(' ( entityName = "'), Field(obj_name,true), Constant(' ('), Field(p0,false)}"
match("MESSAGE#65:SNMP_TRAP_SENT/0", "nwparser.payload", "%{obj_type->} ( entityName = \"%{obj_name->} (%{p0}");

var part103 = // "Pattern{Field(info,false), Constant('..." '), Field(p0,false)}"
match("MESSAGE#65:SNMP_TRAP_SENT/1_0", "nwparser.p0", "%{info}...\" %{p0}");

var part104 = // "Pattern{Field(info,false), Constant('" '), Field(p0,false)}"
match("MESSAGE#65:SNMP_TRAP_SENT/1_1", "nwparser.p0", "%{info}\" %{p0}");

var select32 = linear_select([
	part103,
	part104,
]);

var part105 = // "Pattern{Constant(', sysIpAddress = '), Field(hostip,false), Constant(')')}"
match("MESSAGE#65:SNMP_TRAP_SENT/2", "nwparser.p0", ", sysIpAddress = %{hostip})");

var all26 = all_match({
	processors: [
		part102,
		select32,
		part105,
	],
	on_success: processor_chain([
		dup9,
		dup47,
		dup10,
		dup4,
	]),
});

var msg69 = msg("SNMP_TRAP_SENT", all26);

var part106 = // "Pattern{Field(obj_type,true), Constant(' ( appfwLogMsg = '), Field(obj_name,false), Constant(', sysIpAddress = '), Field(hostip,false), Constant(')')}"
match("MESSAGE#66:SNMP_TRAP_SENT6", "nwparser.payload", "%{obj_type->} ( appfwLogMsg = %{obj_name}, sysIpAddress = %{hostip})", processor_chain([
	dup9,
	dup47,
	dup10,
	dup4,
]));

var msg70 = msg("SNMP_TRAP_SENT6", part106);

var part107 = // "Pattern{Field(obj_type,true), Constant(' ( '), Field(space,true), Constant(' '), Field(p0,false)}"
match("MESSAGE#67:SNMP_TRAP_SENT5/0", "nwparser.payload", "%{obj_type->} ( %{space->} %{p0}");

var part108 = // "Pattern{Constant('partition id = '), Field(fld12,false), Constant(', nsUserName = "'), Field(p0,false)}"
match("MESSAGE#67:SNMP_TRAP_SENT5/1_0", "nwparser.p0", "partition id = %{fld12}, nsUserName = \"%{p0}");

var part109 = // "Pattern{Constant('nsUserName = "'), Field(p0,false)}"
match("MESSAGE#67:SNMP_TRAP_SENT5/1_1", "nwparser.p0", "nsUserName = \"%{p0}");

var select33 = linear_select([
	part108,
	part109,
]);

var part110 = // "Pattern{Constant('",'), Field(username,true), Constant(' configurationCmd = "'), Field(action,false), Constant('", authorizationStatus = '), Field(event_state,false), Constant(', commandExecutionStatus = '), Field(disposition,false), Constant(', '), Field(p0,false)}"
match("MESSAGE#67:SNMP_TRAP_SENT5/2", "nwparser.p0", "\",%{username->} configurationCmd = \"%{action}\", authorizationStatus = %{event_state}, commandExecutionStatus = %{disposition}, %{p0}");

var part111 = // "Pattern{Constant('commandFailureReason = "'), Field(result,false), Constant('", nsClientIPAddr = '), Field(saddr,false), Constant(', sysIpAddress ='), Field(hostip,false), Constant(')')}"
match("MESSAGE#67:SNMP_TRAP_SENT5/3_0", "nwparser.p0", "commandFailureReason = \"%{result}\", nsClientIPAddr = %{saddr}, sysIpAddress =%{hostip})");

var part112 = // "Pattern{Constant('commandFailureReason = "'), Field(result,false), Constant('", nsClientIPAddr = '), Field(saddr,false), Constant(', nsPartitionName = '), Field(fld1,false), Constant(')')}"
match("MESSAGE#67:SNMP_TRAP_SENT5/3_1", "nwparser.p0", "commandFailureReason = \"%{result}\", nsClientIPAddr = %{saddr}, nsPartitionName = %{fld1})");

var part113 = // "Pattern{Constant('nsClientIPAddr = '), Field(saddr,false), Constant(', nsPartitionName = '), Field(fld1,false), Constant(')')}"
match("MESSAGE#67:SNMP_TRAP_SENT5/3_2", "nwparser.p0", "nsClientIPAddr = %{saddr}, nsPartitionName = %{fld1})");

var part114 = // "Pattern{Constant('nsClientIPAddr = '), Field(saddr,false), Constant(', sysIpAddress ='), Field(hostip,true), Constant(' )')}"
match("MESSAGE#67:SNMP_TRAP_SENT5/3_3", "nwparser.p0", "nsClientIPAddr = %{saddr}, sysIpAddress =%{hostip->} )");

var part115 = // "Pattern{Constant('sysIpAddress ='), Field(hostip,false), Constant(')')}"
match("MESSAGE#67:SNMP_TRAP_SENT5/3_4", "nwparser.p0", "sysIpAddress =%{hostip})");

var select34 = linear_select([
	part111,
	part112,
	part113,
	part114,
	part115,
]);

var all27 = all_match({
	processors: [
		part107,
		select33,
		part110,
		select34,
	],
	on_success: processor_chain([
		dup9,
		dup47,
		dup10,
		dup4,
	]),
});

var msg71 = msg("SNMP_TRAP_SENT5", all27);

var part116 = // "Pattern{Field(obj_type,true), Constant(' ( nsUserName = "'), Field(username,false), Constant('", sysIpAddress = '), Field(hostip,false), Constant(')')}"
match("MESSAGE#68:SNMP_TRAP_SENT1", "nwparser.payload", "%{obj_type->} ( nsUserName = \"%{username}\", sysIpAddress = %{hostip})", processor_chain([
	dup9,
	dup47,
	setf("obj_name","username"),
	dup10,
	dup4,
]));

var msg72 = msg("SNMP_TRAP_SENT1", part116);

var part117 = // "Pattern{Field(obj_type,true), Constant(' ( nsCPUusage = '), Field(dclass_counter1,false), Constant(', alarm '), Field(trigger_val,true), Constant(' = '), Field(dclass_counter2,false), Constant(', sysIpAddress = '), Field(hostip,false), Constant(')')}"
match("MESSAGE#69:SNMP_TRAP_SENT2", "nwparser.payload", "%{obj_type->} ( nsCPUusage = %{dclass_counter1}, alarm %{trigger_val->} = %{dclass_counter2}, sysIpAddress = %{hostip})", processor_chain([
	dup9,
	dup47,
	dup10,
	dup4,
]));

var msg73 = msg("SNMP_TRAP_SENT2", part117);

var part118 = // "Pattern{Field(obj_type,true), Constant(' ( sysHealthDiskName = "'), Field(filename,false), Constant('", sysHealthDiskPerusage = '), Field(dclass_counter1,false), Constant(', alarmNormalThreshold = '), Field(dclass_counter2,false), Constant(', sysIpAddress = '), Field(hostip,false), Constant(')')}"
match("MESSAGE#70:SNMP_TRAP_SENT3", "nwparser.payload", "%{obj_type->} ( sysHealthDiskName = \"%{filename}\", sysHealthDiskPerusage = %{dclass_counter1}, alarmNormalThreshold = %{dclass_counter2}, sysIpAddress = %{hostip})", processor_chain([
	dup9,
	dup47,
	dup10,
	dup4,
]));

var msg74 = msg("SNMP_TRAP_SENT3", part118);

var part119 = // "Pattern{Field(obj_type,true), Constant(' ( sysIpAddress = '), Field(hostip,false), Constant(')')}"
match("MESSAGE#71:SNMP_TRAP_SENT4", "nwparser.payload", "%{obj_type->} ( sysIpAddress = %{hostip})", processor_chain([
	dup9,
	dup47,
	dup10,
	dup4,
]));

var msg75 = msg("SNMP_TRAP_SENT4", part119);

var part120 = // "Pattern{Field(obj_type,true), Constant(' (entityName = "'), Field(obj_name,false), Constant('", sysIpAddress = '), Field(hostip,false), Constant(')')}"
match("MESSAGE#72:SNMP_TRAP_SENT18", "nwparser.payload", "%{obj_type->} (entityName = \"%{obj_name}\", sysIpAddress = %{hostip})", processor_chain([
	dup9,
	dup47,
	dup4,
]));

var msg76 = msg("SNMP_TRAP_SENT18", part120);

var part121 = // "Pattern{Field(obj_type,true), Constant(' ( '), Field(space,true), Constant(' nsUserName = "'), Field(username,false), Constant('", sysIpAddress = '), Field(hostip,false), Constant(')')}"
match("MESSAGE#73:SNMP_TRAP_SENT19", "nwparser.payload", "%{obj_type->} ( %{space->} nsUserName = \"%{username}\", sysIpAddress = %{hostip})", processor_chain([
	dup9,
	dup47,
	dup10,
	dup4,
]));

var msg77 = msg("SNMP_TRAP_SENT19", part121);

var part122 = // "Pattern{Field(obj_type,true), Constant(' (partition id = '), Field(fld12,false), Constant(', entityName = "'), Field(p0,false)}"
match("MESSAGE#74:SNMP_TRAP_SENT21/0", "nwparser.payload", "%{obj_type->} (partition id = %{fld12}, entityName = \"%{p0}");

var part123 = // "Pattern{Field(obj_name,false), Constant('('), Field(fld4,false), Constant('...", '), Field(p0,false)}"
match("MESSAGE#74:SNMP_TRAP_SENT21/1_0", "nwparser.p0", "%{obj_name}(%{fld4}...\", %{p0}");

var part124 = // "Pattern{Field(obj_name,false), Constant('...", '), Field(p0,false)}"
match("MESSAGE#74:SNMP_TRAP_SENT21/1_1", "nwparser.p0", "%{obj_name}...\", %{p0}");

var select35 = linear_select([
	part123,
	part124,
]);

var part125 = // "Pattern{Constant('svcGrpMemberFullName.'), Field(fld2,true), Constant(' = "'), Field(fld3,false), Constant('", sysIpAddress = '), Field(hostip,true), Constant(' )')}"
match("MESSAGE#74:SNMP_TRAP_SENT21/2_0", "nwparser.p0", "svcGrpMemberFullName.%{fld2->} = \"%{fld3}\", sysIpAddress = %{hostip->} )");

var part126 = // "Pattern{Constant('vsvrFullName.'), Field(fld2,true), Constant(' = "'), Field(fld3,false), Constant('", sysIpAddress = '), Field(hostip,true), Constant(' )')}"
match("MESSAGE#74:SNMP_TRAP_SENT21/2_1", "nwparser.p0", "vsvrFullName.%{fld2->} = \"%{fld3}\", sysIpAddress = %{hostip->} )");

var part127 = // "Pattern{Constant('sysIpAddress = '), Field(hostip,true), Constant(' )')}"
match("MESSAGE#74:SNMP_TRAP_SENT21/2_2", "nwparser.p0", "sysIpAddress = %{hostip->} )");

var select36 = linear_select([
	part125,
	part126,
	part127,
]);

var all28 = all_match({
	processors: [
		part122,
		select35,
		select36,
	],
	on_success: processor_chain([
		dup9,
		dup47,
		dup10,
		dup4,
	]),
});

var msg78 = msg("SNMP_TRAP_SENT21", all28);

var part128 = // "Pattern{Field(obj_type,true), Constant(' (entityName = "'), Field(p0,false)}"
match("MESSAGE#75:SNMP_TRAP_SENT22/0", "nwparser.payload", "%{obj_type->} (entityName = \"%{p0}");

var part129 = // "Pattern{Field(obj_name,false), Constant('..." '), Field(p0,false)}"
match("MESSAGE#75:SNMP_TRAP_SENT22/1_0", "nwparser.p0", "%{obj_name}...\" %{p0}");

var part130 = // "Pattern{Field(obj_name,false), Constant('"'), Field(p0,false)}"
match("MESSAGE#75:SNMP_TRAP_SENT22/1_1", "nwparser.p0", "%{obj_name}\"%{p0}");

var select37 = linear_select([
	part129,
	part130,
]);

var part131 = // "Pattern{Constant(', '), Field(p0,false)}"
match("MESSAGE#75:SNMP_TRAP_SENT22/2", "nwparser.p0", ", %{p0}");

var part132 = // "Pattern{Constant('svcGrpMemberFullName.'), Field(p0,false)}"
match("MESSAGE#75:SNMP_TRAP_SENT22/3_0", "nwparser.p0", "svcGrpMemberFullName.%{p0}");

var part133 = // "Pattern{Constant('vsvrFullName.'), Field(p0,false)}"
match("MESSAGE#75:SNMP_TRAP_SENT22/3_1", "nwparser.p0", "vsvrFullName.%{p0}");

var part134 = // "Pattern{Constant('svcServiceFullName.'), Field(p0,false)}"
match("MESSAGE#75:SNMP_TRAP_SENT22/3_2", "nwparser.p0", "svcServiceFullName.%{p0}");

var select38 = linear_select([
	part132,
	part133,
	part134,
]);

var part135 = // "Pattern{Field(fld2,true), Constant(' = "'), Field(fld3,false), Constant('", nsPartitionName = '), Field(fld1,false), Constant(')')}"
match("MESSAGE#75:SNMP_TRAP_SENT22/4", "nwparser.p0", "%{fld2->} = \"%{fld3}\", nsPartitionName = %{fld1})");

var all29 = all_match({
	processors: [
		part128,
		select37,
		part131,
		select38,
		part135,
	],
	on_success: processor_chain([
		dup9,
		dup47,
		dup10,
		dup4,
	]),
});

var msg79 = msg("SNMP_TRAP_SENT22", all29);

var part136 = // "Pattern{Field(obj_type,true), Constant(' (platformRateLimitPacketDropCount = '), Field(dclass_counter1,false), Constant(', platformLicensedThroughput = '), Field(fld2,false), Constant(', nsPartitionName = '), Field(fld3,false), Constant(')')}"
match("MESSAGE#76:SNMP_TRAP_SENT23", "nwparser.payload", "%{obj_type->} (platformRateLimitPacketDropCount = %{dclass_counter1}, platformLicensedThroughput = %{fld2}, nsPartitionName = %{fld3})", processor_chain([
	dup9,
	dup47,
	dup10,
	dup4,
]));

var msg80 = msg("SNMP_TRAP_SENT23", part136);

var part137 = // "Pattern{Field(obj_type,true), Constant(' (vsvrName.'), Field(fld2,true), Constant(' = "'), Field(fld3,false), Constant('", vsvrCurSoValue = '), Field(fld4,false), Constant(', vsvrSoMethod = "'), Field(fld5,false), Constant('", vsvrSoThresh = "'), Field(info,false), Constant('", vsvrFullName.'), Field(fld6,true), Constant(' = "'), Field(fld7,false), Constant('", nsPartitionName = '), Field(fld8,false), Constant(')')}"
match("MESSAGE#77:SNMP_TRAP_SENT24", "nwparser.payload", "%{obj_type->} (vsvrName.%{fld2->} = \"%{fld3}\", vsvrCurSoValue = %{fld4}, vsvrSoMethod = \"%{fld5}\", vsvrSoThresh = \"%{info}\", vsvrFullName.%{fld6->} = \"%{fld7}\", nsPartitionName = %{fld8})", processor_chain([
	dup9,
	dup47,
	dup10,
	dup4,
]));

var msg81 = msg("SNMP_TRAP_SENT24", part137);

var part138 = // "Pattern{Field(obj_type,true), Constant(' ('), Field(p0,false)}"
match("MESSAGE#78:SNMP_TRAP_SENT25/0", "nwparser.payload", "%{obj_type->} (%{p0}");

var part139 = // "Pattern{Constant('partition id = '), Field(fld12,false), Constant(', sslCertKeyName.'), Field(p0,false)}"
match("MESSAGE#78:SNMP_TRAP_SENT25/1_0", "nwparser.p0", "partition id = %{fld12}, sslCertKeyName.%{p0}");

var part140 = // "Pattern{Constant(' sslCertKeyName.'), Field(p0,false)}"
match("MESSAGE#78:SNMP_TRAP_SENT25/1_1", "nwparser.p0", " sslCertKeyName.%{p0}");

var select39 = linear_select([
	part139,
	part140,
]);

var part141 = // "Pattern{Constant('",'), Field(fld2,true), Constant(' = "'), Field(fld1,true), Constant(' sslDaysToExpire.'), Field(fld3,true), Constant(' = '), Field(dclass_counter1,false), Constant(', '), Field(p0,false)}"
match("MESSAGE#78:SNMP_TRAP_SENT25/2", "nwparser.p0", "\",%{fld2->} = \"%{fld1->} sslDaysToExpire.%{fld3->} = %{dclass_counter1}, %{p0}");

var part142 = // "Pattern{Constant('nsPartitionName = '), Field(fld4,false), Constant(')')}"
match("MESSAGE#78:SNMP_TRAP_SENT25/3_0", "nwparser.p0", "nsPartitionName = %{fld4})");

var select40 = linear_select([
	part142,
	dup46,
]);

var all30 = all_match({
	processors: [
		part138,
		select39,
		part141,
		select40,
	],
	on_success: processor_chain([
		dup9,
		dup47,
		dup10,
		dup4,
	]),
});

var msg82 = msg("SNMP_TRAP_SENT25", all30);

var part143 = // "Pattern{Field(obj_type,true), Constant(' (nsUserName = "'), Field(username,false), Constant('", nsPartitionName = '), Field(fld1,false), Constant(')')}"
match("MESSAGE#79:SNMP_TRAP_SENT26", "nwparser.payload", "%{obj_type->} (nsUserName = \"%{username}\", nsPartitionName = %{fld1})", processor_chain([
	dup9,
	dup47,
	dup4,
]));

var msg83 = msg("SNMP_TRAP_SENT26", part143);

var part144 = // "Pattern{Field(info,true), Constant(' (sysIpAddress = '), Field(hostip,false), Constant(')')}"
match("MESSAGE#80:SNMP_TRAP_SENT20", "nwparser.payload", "%{info->} (sysIpAddress = %{hostip})", processor_chain([
	dup9,
	dup47,
	dup10,
	dup4,
]));

var msg84 = msg("SNMP_TRAP_SENT20", part144);

var part145 = // "Pattern{Field(obj_type,false), Constant('(lldpRemLocalPortNum.'), Field(fld1,false), Constant('= "'), Field(fld5,false), Constant('", lldpRemChassisId.'), Field(fld2,false), Constant('= "'), Field(dmacaddr,false), Constant('", lldpRemPortId.'), Field(fld3,false), Constant('= "'), Field(dinterface,false), Constant('", sysIpAddress ='), Field(hostip,false), Constant(')')}"
match("MESSAGE#81:SNMP_TRAP_SENT28", "nwparser.payload", "%{obj_type}(lldpRemLocalPortNum.%{fld1}= \"%{fld5}\", lldpRemChassisId.%{fld2}= \"%{dmacaddr}\", lldpRemPortId.%{fld3}= \"%{dinterface}\", sysIpAddress =%{hostip})", processor_chain([
	dup9,
	dup47,
	dup10,
	dup4,
]));

var msg85 = msg("SNMP_TRAP_SENT28", part145);

var part146 = // "Pattern{Field(obj_type,false), Constant('(haNicMonitorSucceeded = "'), Field(fld1,false), Constant('", sysIpAddress ='), Field(hostip,false), Constant(')')}"
match("MESSAGE#82:SNMP_TRAP_SENT29", "nwparser.payload", "%{obj_type}(haNicMonitorSucceeded = \"%{fld1}\", sysIpAddress =%{hostip})", processor_chain([
	dup9,
	dup47,
	dup10,
	dup4,
]));

var msg86 = msg("SNMP_TRAP_SENT29", part146);

var part147 = // "Pattern{Field(fld1,false), Constant(':StatusPoll:'), Field(fld2,true), Constant(' - Device State changed to '), Field(disposition,true), Constant(' for '), Field(saddr,false)}"
match("MESSAGE#83:SNMP_TRAP_SENT:04", "nwparser.payload", "%{fld1}:StatusPoll:%{fld2->} - Device State changed to %{disposition->} for %{saddr}", processor_chain([
	dup9,
	dup4,
	setc("event_description","Device State changed"),
]));

var msg87 = msg("SNMP_TRAP_SENT:04", part147);

var msg88 = msg("SNMP_TRAP_SENT:05", dup101);

var part148 = // "Pattern{Field(obj_type,true), Constant(' (appfwLogMsg = "'), Field(obj_name,true), Constant(' '), Field(info,false), Constant('",'), Field(p0,false)}"
match("MESSAGE#136:SNMP_TRAP_SENT:01/0", "nwparser.payload", "%{obj_type->} (appfwLogMsg = \"%{obj_name->} %{info}\",%{p0}");

var part149 = // "Pattern{Constant('sysIpAddress = '), Field(hostip,false)}"
match("MESSAGE#136:SNMP_TRAP_SENT:01/1_0", "nwparser.p0", "sysIpAddress = %{hostip}");

var part150 = // "Pattern{Constant('nsPartitionName ='), Field(fld1,false)}"
match("MESSAGE#136:SNMP_TRAP_SENT:01/1_1", "nwparser.p0", "nsPartitionName =%{fld1}");

var select41 = linear_select([
	part149,
	part150,
]);

var all31 = all_match({
	processors: [
		part148,
		select41,
	],
	on_success: processor_chain([
		dup9,
		dup47,
		dup10,
		dup4,
	]),
});

var msg89 = msg("SNMP_TRAP_SENT:01", all31);

var part151 = // "Pattern{Field(obj_type,true), Constant(' (haNicsMonitorFailed = "'), Field(fld1,false), Constant('", sysIpAddress = '), Field(hostip,false), Constant(')')}"
match("MESSAGE#143:SNMP_TRAP_SENT:02", "nwparser.payload", "%{obj_type->} (haNicsMonitorFailed = \"%{fld1}\", sysIpAddress = %{hostip})", processor_chain([
	dup9,
	dup47,
	dup10,
	dup4,
]));

var msg90 = msg("SNMP_TRAP_SENT:02", part151);

var part152 = // "Pattern{Field(obj_type,true), Constant(' (partition id = '), Field(fld1,false), Constant(', entityName = "'), Field(obj_name,false), Constant('('), Field(fld31,false), Constant('", svcServiceFullName.'), Field(fld2,true), Constant(' = "'), Field(fld3,false), Constant('", sysIpAddress = '), Field(hostip,false), Constant(')')}"
match("MESSAGE#178:SNMP_TRAP_SENT27", "nwparser.payload", "%{obj_type->} (partition id = %{fld1}, entityName = \"%{obj_name}(%{fld31}\", svcServiceFullName.%{fld2->} = \"%{fld3}\", sysIpAddress = %{hostip})", processor_chain([
	dup9,
	dup47,
	dup10,
	dup4,
]));

var msg91 = msg("SNMP_TRAP_SENT27", part152);

var part153 = // "Pattern{Field(obj_type,false), Constant('(sysHealthCounterName.PowerSupply1Status = "'), Field(dclass_counter1_string,false), Constant('", sysHealthCounterValue.PowerSupply1Status = '), Field(dclass_counter1,false), Constant(', sysHealthPowerSupplyStatus = "'), Field(result,false), Constant('", sysIpAddress ='), Field(hostip,false), Constant(')')}"
match("MESSAGE#179:SNMP_TRAP_SENT:03", "nwparser.payload", "%{obj_type}(sysHealthCounterName.PowerSupply1Status = \"%{dclass_counter1_string}\", sysHealthCounterValue.PowerSupply1Status = %{dclass_counter1}, sysHealthPowerSupplyStatus = \"%{result}\", sysIpAddress =%{hostip})", processor_chain([
	dup9,
	dup47,
	dup4,
]));

var msg92 = msg("SNMP_TRAP_SENT:03", part153);

var select42 = linear_select([
	msg58,
	msg59,
	msg60,
	msg61,
	msg62,
	msg63,
	msg64,
	msg65,
	msg66,
	msg67,
	msg68,
	msg69,
	msg70,
	msg71,
	msg72,
	msg73,
	msg74,
	msg75,
	msg76,
	msg77,
	msg78,
	msg79,
	msg80,
	msg81,
	msg82,
	msg83,
	msg84,
	msg85,
	msg86,
	msg87,
	msg88,
	msg89,
	msg90,
	msg91,
	msg92,
]);

var part154 = // "Pattern{Constant('User '), Field(username,true), Constant(' - Client IP '), Field(hostip,true), Constant(' - Vserver '), Field(saddr,false), Constant(':'), Field(sport,true), Constant(' - Client_security_expression "CLIENT.REG(''), Field(info,false), Constant('').VALUE == '), Field(trigger_val,true), Constant(' || '), Field(change_new,true), Constant(' - '), Field(result,false)}"
match("MESSAGE#85:SSLVPN_CLISEC_CHECK", "nwparser.payload", "User %{username->} - Client IP %{hostip->} - Vserver %{saddr}:%{sport->} - Client_security_expression \"CLIENT.REG('%{info}').VALUE == %{trigger_val->} || %{change_new->} - %{result}", processor_chain([
	dup9,
	dup47,
	dup4,
]));

var msg93 = msg("SSLVPN_CLISEC_CHECK", part154);

var part155 = // "Pattern{Constant('SPCBId '), Field(sessionid,true), Constant(' - ClientIP '), Field(p0,false)}"
match("MESSAGE#86:SSLLOG_SSL_HANDSHAKE_FAILURE/1_1", "nwparser.p0", "SPCBId %{sessionid->} - ClientIP %{p0}");

var select43 = linear_select([
	dup49,
	part155,
]);

var part156 = // "Pattern{Field(,true), Constant(' '), Field(saddr,false), Constant('- ClientPort '), Field(sport,true), Constant(' - VserverServiceIP '), Field(daddr,true), Constant(' - VserverServicePort '), Field(dport,true), Constant(' - ClientVersion '), Field(s_sslver,true), Constant(' - CipherSuite "'), Field(s_cipher,false), Constant('" - Reason "'), Field(result,false), Constant('"')}"
match("MESSAGE#86:SSLLOG_SSL_HANDSHAKE_FAILURE/2", "nwparser.p0", "%{} %{saddr}- ClientPort %{sport->} - VserverServiceIP %{daddr->} - VserverServicePort %{dport->} - ClientVersion %{s_sslver->} - CipherSuite \"%{s_cipher}\" - Reason \"%{result}\"");

var all32 = all_match({
	processors: [
		dup48,
		select43,
		part156,
	],
	on_success: processor_chain([
		dup11,
		dup40,
		dup8,
		setc("event_description","SSL Handshake failed"),
		dup41,
		dup4,
	]),
});

var msg94 = msg("SSLLOG_SSL_HANDSHAKE_FAILURE", all32);

var part157 = // "Pattern{Constant('SPCBId '), Field(sessionid,true), Constant(' ClientIP '), Field(p0,false)}"
match("MESSAGE#87:SSLLOG_SSL_HANDSHAKE_SUCCESS/1_0", "nwparser.p0", "SPCBId %{sessionid->} ClientIP %{p0}");

var select44 = linear_select([
	part157,
	dup49,
]);

var part158 = // "Pattern{Constant(''), Field(saddr,true), Constant(' - ClientPort '), Field(sport,true), Constant(' - VserverServiceIP '), Field(daddr,true), Constant(' - VserverServicePort '), Field(dport,true), Constant(' - ClientVersion '), Field(s_sslver,true), Constant(' - CipherSuite "'), Field(s_cipher,false), Constant('" - Session '), Field(info,false)}"
match("MESSAGE#87:SSLLOG_SSL_HANDSHAKE_SUCCESS/2", "nwparser.p0", "%{saddr->} - ClientPort %{sport->} - VserverServiceIP %{daddr->} - VserverServicePort %{dport->} - ClientVersion %{s_sslver->} - CipherSuite \"%{s_cipher}\" - Session %{info}");

var all33 = all_match({
	processors: [
		dup48,
		select44,
		part158,
	],
	on_success: processor_chain([
		dup2,
		dup40,
		setc("ec_outcome","Success"),
		setc("event_description","SSL Handshake succeeded"),
		dup41,
		dup4,
	]),
});

var msg95 = msg("SSLLOG_SSL_HANDSHAKE_SUCCESS", all33);

var part159 = // "Pattern{Constant('SPCBId '), Field(sessionid,true), Constant(' - SubjectName "'), Field(cert_subject,false), Constant('"')}"
match("MESSAGE#88:SSLLOG_SSL_HANDSHAKE_SUBJECTNAME", "nwparser.payload", "SPCBId %{sessionid->} - SubjectName \"%{cert_subject}\"", processor_chain([
	dup9,
	dup41,
	dup50,
]));

var msg96 = msg("SSLLOG_SSL_HANDSHAKE_SUBJECTNAME", part159);

var part160 = // "Pattern{Constant('SPCBId '), Field(sessionid,true), Constant(' - IssuerName "'), Field(fld1,false), Constant('"')}"
match("MESSAGE#89:SSLLOG_SSL_HANDSHAKE_ISSUERNAME", "nwparser.payload", "SPCBId %{sessionid->} - IssuerName \"%{fld1}\"", processor_chain([
	dup9,
	dup41,
	dup50,
]));

var msg97 = msg("SSLLOG_SSL_HANDSHAKE_ISSUERNAME", part160);

var part161 = // "Pattern{Constant('Extracted_groups "'), Field(group,false), Constant('"')}"
match("MESSAGE#90:SSLVPN_AAAEXTRACTED_GROUPS", "nwparser.payload", "Extracted_groups \"%{group}\"", processor_chain([
	dup2,
	setc("event_description","The groups extracted after user logs into SSLVPN"),
	dup3,
	dup4,
]));

var msg98 = msg("SSLVPN_AAAEXTRACTED_GROUPS", part161);

var part162 = // "Pattern{Constant('User '), Field(username,true), Constant(' : - Client IP '), Field(hostip,true), Constant(' - Vserver '), Field(saddr,false), Constant(':'), Field(sport,true), Constant(' - Client security expression CLIENT.REG(''), Field(info,false), Constant('') '), Field(p0,false)}"
match("MESSAGE#91:SSLVPN_CLISEC_EXP_EVAL/0", "nwparser.payload", "User %{username->} : - Client IP %{hostip->} - Vserver %{saddr}:%{sport->} - Client security expression CLIENT.REG('%{info}') %{p0}");

var part163 = // "Pattern{Constant('EXISTS '), Field(p0,false)}"
match("MESSAGE#91:SSLVPN_CLISEC_EXP_EVAL/1_0", "nwparser.p0", "EXISTS %{p0}");

var part164 = // "Pattern{Constant('.VALUE == '), Field(trigger_val,true), Constant(' '), Field(p0,false)}"
match("MESSAGE#91:SSLVPN_CLISEC_EXP_EVAL/1_1", "nwparser.p0", ".VALUE == %{trigger_val->} %{p0}");

var select45 = linear_select([
	part163,
	part164,
]);

var part165 = // "Pattern{Constant('evaluated to '), Field(change_new,false), Constant('('), Field(ntype,false), Constant(')')}"
match("MESSAGE#91:SSLVPN_CLISEC_EXP_EVAL/2", "nwparser.p0", "evaluated to %{change_new}(%{ntype})");

var all34 = all_match({
	processors: [
		part162,
		select45,
		part165,
	],
	on_success: processor_chain([
		dup2,
		setc("event_description","SSLVPN session Client Security expression EXISTS and evaluated"),
		dup3,
		dup4,
	]),
});

var msg99 = msg("SSLVPN_CLISEC_EXP_EVAL", all34);

var part166 = // "Pattern{Constant('Context '), Field(fld1,true), Constant(' - '), Field(p0,false)}"
match("MESSAGE#92:SSLVPN_HTTPREQUEST/0", "nwparser.payload", "Context %{fld1->} - %{p0}");

var part167 = // "Pattern{Constant('SessionId: '), Field(sessionid,true), Constant(' User '), Field(p0,false)}"
match("MESSAGE#92:SSLVPN_HTTPREQUEST/1_0", "nwparser.p0", "SessionId: %{sessionid->} User %{p0}");

var part168 = // "Pattern{Field(fld5,true), Constant(' User '), Field(p0,false)}"
match("MESSAGE#92:SSLVPN_HTTPREQUEST/1_1", "nwparser.p0", "%{fld5->} User %{p0}");

var select46 = linear_select([
	part167,
	part168,
]);

var part169 = // "Pattern{Field(username,true), Constant(' : Group(s) '), Field(group,true), Constant(' : '), Field(p0,false)}"
match("MESSAGE#92:SSLVPN_HTTPREQUEST/2", "nwparser.p0", "%{username->} : Group(s) %{group->} : %{p0}");

var part170 = // "Pattern{Constant('Vserver '), Field(hostip,true), Constant(' - '), Field(fld6,true), Constant(' '), Field(p0,false)}"
match("MESSAGE#92:SSLVPN_HTTPREQUEST/3_0", "nwparser.p0", "Vserver %{hostip->} - %{fld6->} %{p0}");

var part171 = // "Pattern{Constant('- '), Field(fld7,true), Constant(' '), Field(p0,false)}"
match("MESSAGE#92:SSLVPN_HTTPREQUEST/3_1", "nwparser.p0", "- %{fld7->} %{p0}");

var select47 = linear_select([
	part170,
	part171,
]);

var part172 = // "Pattern{Constant('GMT '), Field(web_method,true), Constant(' '), Field(p0,false)}"
match("MESSAGE#92:SSLVPN_HTTPREQUEST/4_0", "nwparser.p0", "GMT %{web_method->} %{p0}");

var part173 = // "Pattern{Field(web_method,true), Constant(' '), Field(p0,false)}"
match("MESSAGE#92:SSLVPN_HTTPREQUEST/4_1", "nwparser.p0", "%{web_method->} %{p0}");

var select48 = linear_select([
	part172,
	part173,
]);

var part174 = // "Pattern{Field(url,true), Constant(' '), Field(fld8,false)}"
match("MESSAGE#92:SSLVPN_HTTPREQUEST/5", "nwparser.p0", "%{url->} %{fld8}");

var all35 = all_match({
	processors: [
		part166,
		select46,
		part169,
		select47,
		select48,
		part174,
	],
	on_success: processor_chain([
		dup2,
		dup51,
		setc("event_description","SSLVPN session receives a HTTP request"),
		dup3,
		dup4,
	]),
});

var msg100 = msg("SSLVPN_HTTPREQUEST", all35);

var part175 = // "Pattern{Constant('Source '), Field(saddr,false), Constant(':'), Field(sport,true), Constant(' - Destination '), Field(dtransaddr,false), Constant(':'), Field(dtransport,true), Constant(' - Start_time '), Field(p0,false)}"
match("MESSAGE#93:SSLVPN_ICAEND_CONNSTAT/0", "nwparser.payload", "Source %{saddr}:%{sport->} - Destination %{dtransaddr}:%{dtransport->} - Start_time %{p0}");

var part176 = // "Pattern{Field(duration_string,true), Constant(' - Total_bytes_send '), Field(sbytes,true), Constant(' - Total_bytes_recv '), Field(rbytes,true), Constant(' - Total_compressedbytes_send '), Field(comp_sbytes,true), Constant(' - Total_compressedbytes_recv '), Field(comp_rbytes,true), Constant(' - Compression_ratio_send '), Field(dclass_ratio1,true), Constant(' - Compression_ratio_recv '), Field(dclass_ratio2,false)}"
match("MESSAGE#93:SSLVPN_ICAEND_CONNSTAT/3", "nwparser.p0", "%{duration_string->} - Total_bytes_send %{sbytes->} - Total_bytes_recv %{rbytes->} - Total_compressedbytes_send %{comp_sbytes->} - Total_compressedbytes_recv %{comp_rbytes->} - Compression_ratio_send %{dclass_ratio1->} - Compression_ratio_recv %{dclass_ratio2}");

var all36 = all_match({
	processors: [
		part175,
		dup102,
		dup103,
		part176,
	],
	on_success: processor_chain([
		dup9,
		dup58,
		dup59,
		dup60,
		dup3,
		dup61,
		dup62,
		dup4,
	]),
});

var msg101 = msg("SSLVPN_ICAEND_CONNSTAT", all36);

var part177 = // "Pattern{Constant('Source '), Field(saddr,false), Constant(':'), Field(sport,true), Constant(' - Destination '), Field(dtransaddr,false), Constant(':'), Field(dtransport,true), Constant(' - username:domainname '), Field(username,false), Constant(':'), Field(ddomain,true), Constant(' - startTime '), Field(p0,false)}"
match("MESSAGE#139:SSLVPN_ICAEND_CONNSTAT:01/0", "nwparser.payload", "Source %{saddr}:%{sport->} - Destination %{dtransaddr}:%{dtransport->} - username:domainname %{username}:%{ddomain->} - startTime %{p0}");

var part178 = // "Pattern{Constant('" '), Field(fld10,true), Constant(' GMT" - endTime '), Field(p0,false)}"
match("MESSAGE#139:SSLVPN_ICAEND_CONNSTAT:01/1_0", "nwparser.p0", "\" %{fld10->} GMT\" - endTime %{p0}");

var part179 = // "Pattern{Constant('" '), Field(fld10,false), Constant('" - endTime '), Field(p0,false)}"
match("MESSAGE#139:SSLVPN_ICAEND_CONNSTAT:01/1_1", "nwparser.p0", "\" %{fld10}\" - endTime %{p0}");

var part180 = // "Pattern{Field(fld10,true), Constant(' - endTime '), Field(p0,false)}"
match("MESSAGE#139:SSLVPN_ICAEND_CONNSTAT:01/1_2", "nwparser.p0", "%{fld10->} - endTime %{p0}");

var select49 = linear_select([
	part178,
	part179,
	part180,
]);

var part181 = // "Pattern{Field(duration_string,true), Constant(' - Total_bytes_send '), Field(sbytes,true), Constant(' - Total_bytes_recv '), Field(rbytes,true), Constant(' - Total_compressedbytes_send '), Field(comp_sbytes,true), Constant(' - Total_compressedbytes_recv '), Field(comp_rbytes,true), Constant(' - Compression_ratio_send '), Field(dclass_ratio1,true), Constant(' - Compression_ratio_recv '), Field(dclass_ratio2,true), Constant(' '), Field(p0,false)}"
match("MESSAGE#139:SSLVPN_ICAEND_CONNSTAT:01/3", "nwparser.p0", "%{duration_string->} - Total_bytes_send %{sbytes->} - Total_bytes_recv %{rbytes->} - Total_compressedbytes_send %{comp_sbytes->} - Total_compressedbytes_recv %{comp_rbytes->} - Compression_ratio_send %{dclass_ratio1->} - Compression_ratio_recv %{dclass_ratio2->} %{p0}");

var part182 = // "Pattern{Constant('- connectionId '), Field(connectionid,false)}"
match("MESSAGE#139:SSLVPN_ICAEND_CONNSTAT:01/4_0", "nwparser.p0", "- connectionId %{connectionid}");

var part183 = // "Pattern{Field(fld2,false)}"
match_copy("MESSAGE#139:SSLVPN_ICAEND_CONNSTAT:01/4_1", "nwparser.p0", "fld2");

var select50 = linear_select([
	part182,
	part183,
]);

var all37 = all_match({
	processors: [
		part177,
		select49,
		dup103,
		part181,
		select50,
	],
	on_success: processor_chain([
		dup9,
		dup58,
		dup59,
		dup60,
		dup3,
		dup61,
		dup62,
		dup4,
	]),
});

var msg102 = msg("SSLVPN_ICAEND_CONNSTAT:01", all37);

var select51 = linear_select([
	msg101,
	msg102,
]);

var part184 = // "Pattern{Field(daddr,false), Constant(':'), Field(dport,true), Constant(' - Browser_type '), Field(fld2,true), Constant(' - SSLVPN_client_type '), Field(info,true), Constant(' - Group(s) "'), Field(group,false), Constant('"')}"
match("MESSAGE#94:SSLVPN_LOGIN/4", "nwparser.p0", "%{daddr}:%{dport->} - Browser_type %{fld2->} - SSLVPN_client_type %{info->} - Group(s) \"%{group}\"");

var all38 = all_match({
	processors: [
		dup48,
		dup104,
		dup66,
		dup105,
		part184,
	],
	on_success: processor_chain([
		dup69,
		dup6,
		dup7,
		setc("event_description","SSLVPN login succeeds"),
		dup3,
		dup4,
	]),
});

var msg103 = msg("SSLVPN_LOGIN", all38);

var part185 = // "Pattern{Field(duration_string,true), Constant(' - Http_resources_accessed '), Field(fld3,true), Constant(' - NonHttp_services_accessed '), Field(fld4,true), Constant(' - Total_TCP_connections '), Field(fld5,true), Constant(' - Total_UDP_flows '), Field(fld6,true), Constant(' - Total_policies_allowed '), Field(fld7,true), Constant(' - Total_policies_denied '), Field(fld8,true), Constant(' - Total_bytes_send '), Field(sbytes,true), Constant(' - Total_bytes_recv '), Field(rbytes,true), Constant(' - Total_compressedbytes_send '), Field(comp_sbytes,true), Constant(' - Total_compressedbytes_recv '), Field(comp_rbytes,true), Constant(' - Compression_ratio_send '), Field(dclass_ratio1,true), Constant(' - Compression_ratio_recv '), Field(dclass_ratio2,true), Constant(' - LogoutMethod "'), Field(result,false), Constant('" - Group(s) "'), Field(group,false), Constant('"')}"
match("MESSAGE#95:SSLVPN_LOGOUT/7", "nwparser.p0", "%{duration_string->} - Http_resources_accessed %{fld3->} - NonHttp_services_accessed %{fld4->} - Total_TCP_connections %{fld5->} - Total_UDP_flows %{fld6->} - Total_policies_allowed %{fld7->} - Total_policies_denied %{fld8->} - Total_bytes_send %{sbytes->} - Total_bytes_recv %{rbytes->} - Total_compressedbytes_send %{comp_sbytes->} - Total_compressedbytes_recv %{comp_rbytes->} - Compression_ratio_send %{dclass_ratio1->} - Compression_ratio_recv %{dclass_ratio2->} - LogoutMethod \"%{result}\" - Group(s) \"%{group}\"");

var all39 = all_match({
	processors: [
		dup48,
		dup104,
		dup66,
		dup105,
		dup70,
		dup102,
		dup103,
		part185,
	],
	on_success: processor_chain([
		dup71,
		dup72,
		dup7,
		setc("event_description","SSLVPN session logs out"),
		dup59,
		dup60,
		setc("event_description"," Default Event"),
		dup3,
		dup61,
		dup62,
		dup4,
	]),
});

var msg104 = msg("SSLVPN_LOGOUT", all39);

var part186 = // "Pattern{Field(daddr,false), Constant(':'), Field(dport,true), Constant(' - Last_contact '), Field(fld2,true), Constant(' - Group(s) "'), Field(group,false), Constant('"')}"
match("MESSAGE#96:SSLVPN_TCPCONN_TIMEDOUT/4", "nwparser.p0", "%{daddr}:%{dport->} - Last_contact %{fld2->} - Group(s) \"%{group}\"");

var all40 = all_match({
	processors: [
		dup48,
		dup104,
		dup66,
		dup105,
		part186,
	],
	on_success: processor_chain([
		setc("eventcategory","1801030100"),
		dup72,
		dup7,
		setc("event_description","SSLVPN TCP Connection Timed Out"),
		dup3,
		dup4,
	]),
});

var msg105 = msg("SSLVPN_TCPCONN_TIMEDOUT", all40);

var part187 = // "Pattern{Field(daddr,false), Constant(':'), Field(dport,true), Constant(' - Source '), Field(saddr,false), Constant(':'), Field(sport,true), Constant(' - Destination '), Field(dtransaddr,false), Constant(':'), Field(dtransport,true), Constant(' - Start_time '), Field(p0,false)}"
match("MESSAGE#97:SSLVPN_UDPFLOWSTAT/2", "nwparser.p0", "%{daddr}:%{dport->} - Source %{saddr}:%{sport->} - Destination %{dtransaddr}:%{dtransport->} - Start_time %{p0}");

var part188 = // "Pattern{Field(duration_string,true), Constant(' - Total_bytes_send '), Field(sbytes,true), Constant(' - Total_bytes_recv '), Field(rbytes,true), Constant(' - Access '), Field(disposition,true), Constant(' - Group(s) "'), Field(group,false), Constant('"')}"
match("MESSAGE#97:SSLVPN_UDPFLOWSTAT/5", "nwparser.p0", "%{duration_string->} - Total_bytes_send %{sbytes->} - Total_bytes_recv %{rbytes->} - Access %{disposition->} - Group(s) \"%{group}\"");

var all41 = all_match({
	processors: [
		dup73,
		dup105,
		part187,
		dup102,
		dup103,
		part188,
	],
	on_success: processor_chain([
		dup69,
		setc("event_description","SSLVPN UDP Flow Statistics"),
		dup3,
		dup61,
		dup62,
		dup4,
	]),
});

var msg106 = msg("SSLVPN_UDPFLOWSTAT", all41);

var part189 = // "Pattern{Constant('Server port = '), Field(dport,true), Constant(' - Server server ip = '), Field(daddr,true), Constant(' - username:domain_name = '), Field(username,false), Constant(':'), Field(ddomain,true), Constant(' - application name = '), Field(application,false)}"
match("MESSAGE#98:SSLVPN_ICASTART", "nwparser.payload", "Server port = %{dport->} - Server server ip = %{daddr->} - username:domain_name = %{username}:%{ddomain->} - application name = %{application}", processor_chain([
	dup69,
	setc("event_description","ICA started"),
	dup3,
	dup4,
]));

var msg107 = msg("SSLVPN_ICASTART", part189);

var part190 = // "Pattern{Constant('Source '), Field(saddr,false), Constant(':'), Field(sport,true), Constant(' - Destination '), Field(dtransaddr,false), Constant(':'), Field(dtransport,true), Constant(' - username:domainname '), Field(username,false), Constant(':'), Field(ddomain,true), Constant(' - applicationName '), Field(application,true), Constant(' - startTime '), Field(p0,false)}"
match("MESSAGE#99:SSLVPN_ICASTART:01/0", "nwparser.payload", "Source %{saddr}:%{sport->} - Destination %{dtransaddr}:%{dtransport->} - username:domainname %{username}:%{ddomain->} - applicationName %{application->} - startTime %{p0}");

var part191 = // "Pattern{Constant('" '), Field(fld10,true), Constant(' GMT" - connectionId '), Field(p0,false)}"
match("MESSAGE#99:SSLVPN_ICASTART:01/1_0", "nwparser.p0", "\" %{fld10->} GMT\" - connectionId %{p0}");

var part192 = // "Pattern{Constant('" '), Field(fld10,false), Constant('" - connectionId '), Field(p0,false)}"
match("MESSAGE#99:SSLVPN_ICASTART:01/1_1", "nwparser.p0", "\" %{fld10}\" - connectionId %{p0}");

var part193 = // "Pattern{Field(fld10,true), Constant(' - connectionId '), Field(p0,false)}"
match("MESSAGE#99:SSLVPN_ICASTART:01/1_2", "nwparser.p0", "%{fld10->} - connectionId %{p0}");

var select52 = linear_select([
	part191,
	part192,
	part193,
]);

var part194 = // "Pattern{Field(fld5,false)}"
match_copy("MESSAGE#99:SSLVPN_ICASTART:01/2", "nwparser.p0", "fld5");

var all42 = all_match({
	processors: [
		part190,
		select52,
		part194,
	],
	on_success: processor_chain([
		dup9,
		dup62,
		dup4,
	]),
});

var msg108 = msg("SSLVPN_ICASTART:01", all42);

var select53 = linear_select([
	msg107,
	msg108,
]);

var part195 = // "Pattern{Field(action,false), Constant(': '), Field(fld1,true), Constant(' "')}"
match("MESSAGE#100:SSLVPN_Message/1_0", "nwparser.p0", "%{action}: %{fld1->} \"");

var part196 = // "Pattern{Field(action,true), Constant(' '), Field(fld1,false), Constant('"')}"
match("MESSAGE#100:SSLVPN_Message/1_1", "nwparser.p0", "%{action->} %{fld1}\"");

var part197 = // "Pattern{Field(action,false), Constant(': '), Field(fld1,false)}"
match("MESSAGE#100:SSLVPN_Message/1_2", "nwparser.p0", "%{action}: %{fld1}");

var select54 = linear_select([
	part195,
	part196,
	part197,
]);

var all43 = all_match({
	processors: [
		dup74,
		select54,
	],
	on_success: processor_chain([
		dup2,
		setc("event_description","Message"),
		dup10,
		dup4,
	]),
});

var msg109 = msg("SSLVPN_Message", all43);

var part198 = // "Pattern{Field(,true), Constant(' '), Field(username,false), Constant('- Client_ip '), Field(hostip,true), Constant(' - Nat_ip '), Field(stransaddr,true), Constant(' - Vserver '), Field(daddr,false), Constant(':'), Field(dport,true), Constant(' - Source '), Field(saddr,false), Constant(':'), Field(sport,true), Constant(' - Destination '), Field(dtransaddr,false), Constant(':'), Field(dtransport,true), Constant(' - Start_time '), Field(p0,false)}"
match("MESSAGE#101:SSLVPN_TCPCONNSTAT/2", "nwparser.p0", "%{} %{username}- Client_ip %{hostip->} - Nat_ip %{stransaddr->} - Vserver %{daddr}:%{dport->} - Source %{saddr}:%{sport->} - Destination %{dtransaddr}:%{dtransport->} - Start_time %{p0}");

var part199 = // "Pattern{Field(duration_string,true), Constant(' - Total_bytes_send '), Field(sbytes,true), Constant(' - Total_bytes_recv '), Field(rbytes,true), Constant(' - Total_compressedbytes_send '), Field(comp_sbytes,true), Constant(' - Total_compressedbytes_recv '), Field(comp_rbytes,true), Constant(' - Compression_ratio_send '), Field(dclass_ratio1,true), Constant(' - Compression_ratio_recv '), Field(dclass_ratio2,true), Constant(' - Access '), Field(disposition,true), Constant(' - Group(s) "'), Field(group,false), Constant('"')}"
match("MESSAGE#101:SSLVPN_TCPCONNSTAT/5", "nwparser.p0", "%{duration_string->} - Total_bytes_send %{sbytes->} - Total_bytes_recv %{rbytes->} - Total_compressedbytes_send %{comp_sbytes->} - Total_compressedbytes_recv %{comp_rbytes->} - Compression_ratio_send %{dclass_ratio1->} - Compression_ratio_recv %{dclass_ratio2->} - Access %{disposition->} - Group(s) \"%{group}\"");

var all44 = all_match({
	processors: [
		dup48,
		dup104,
		part198,
		dup102,
		dup103,
		part199,
	],
	on_success: processor_chain([
		dup9,
		setc("event_description","TCP connection related information for a connection belonging to a SSLVPN session"),
		dup59,
		dup60,
		dup3,
		dup61,
		dup62,
		dup4,
	]),
});

var msg110 = msg("SSLVPN_TCPCONNSTAT", all44);

var all45 = all_match({
	processors: [
		dup75,
		dup106,
		dup78,
	],
	on_success: processor_chain([
		dup2,
		dup40,
		dup30,
		dup79,
		dup3,
		dup61,
		dup4,
	]),
});

var msg111 = msg("TCP_CONN_DELINK", all45);

var all46 = all_match({
	processors: [
		dup80,
		dup107,
		dup106,
		dup78,
	],
	on_success: processor_chain([
		dup2,
		dup40,
		dup28,
		dup83,
		dup3,
		dup61,
		dup62,
		dup4,
	]),
});

var msg112 = msg("TCP_CONN_TERMINATE", all46);

var part200 = // "Pattern{Constant('Source '), Field(saddr,false), Constant('Total_bytes_send '), Field(sbytes,true), Constant(' - Total_bytes_recv '), Field(rbytes,false)}"
match("MESSAGE#140:TCP_CONN_TERMINATE:01", "nwparser.payload", "Source %{saddr}Total_bytes_send %{sbytes->} - Total_bytes_recv %{rbytes}", processor_chain([
	dup2,
	dup40,
	dup28,
	dup83,
	dup3,
	dup4,
]));

var msg113 = msg("TCP_CONN_TERMINATE:01", part200);

var select55 = linear_select([
	msg112,
	msg113,
]);

var part201 = // "Pattern{Field(fld11,true), Constant(' GMT Total_bytes_send '), Field(p0,false)}"
match("MESSAGE#104:TCP_OTHERCONN_DELINK/1_0", "nwparser.p0", "%{fld11->} GMT Total_bytes_send %{p0}");

var part202 = // "Pattern{Field(fld11,true), Constant(' Total_bytes_send '), Field(p0,false)}"
match("MESSAGE#104:TCP_OTHERCONN_DELINK/1_1", "nwparser.p0", "%{fld11->} Total_bytes_send %{p0}");

var select56 = linear_select([
	part201,
	part202,
]);

var all47 = all_match({
	processors: [
		dup75,
		select56,
		dup78,
	],
	on_success: processor_chain([
		dup2,
		dup40,
		dup30,
		setc("event_description","A Server side and a Client side TCP connection is delinked. This is not tracked by Netscaler"),
		dup3,
		dup61,
		dup4,
	]),
});

var msg114 = msg("TCP_OTHERCONN_DELINK", all47);

var part203 = // "Pattern{Constant('Source '), Field(saddr,false), Constant(':'), Field(sport,true), Constant(' - Destination '), Field(daddr,false), Constant(':'), Field(dport,true), Constant(' - NatIP '), Field(stransaddr,false), Constant(':'), Field(stransport,true), Constant(' - Destination '), Field(dtransaddr,false), Constant(':'), Field(dtransport,true), Constant(' - Start Time '), Field(p0,false)}"
match("MESSAGE#105:TCP_NAT_OTHERCONN_DELINK/0", "nwparser.payload", "Source %{saddr}:%{sport->} - Destination %{daddr}:%{dport->} - NatIP %{stransaddr}:%{stransport->} - Destination %{dtransaddr}:%{dtransport->} - Start Time %{p0}");

var part204 = // "Pattern{Field(fld10,true), Constant(' GMT - Delink Time '), Field(p0,false)}"
match("MESSAGE#105:TCP_NAT_OTHERCONN_DELINK/1_0", "nwparser.p0", "%{fld10->} GMT - Delink Time %{p0}");

var part205 = // "Pattern{Field(fld10,true), Constant(' - Delink Time '), Field(p0,false)}"
match("MESSAGE#105:TCP_NAT_OTHERCONN_DELINK/1_1", "nwparser.p0", "%{fld10->} - Delink Time %{p0}");

var select57 = linear_select([
	part204,
	part205,
]);

var part206 = // "Pattern{Field(sbytes,true), Constant(' - Total_bytes_recv '), Field(rbytes,true), Constant(' - '), Field(info,false)}"
match("MESSAGE#105:TCP_NAT_OTHERCONN_DELINK/3", "nwparser.p0", "%{sbytes->} - Total_bytes_recv %{rbytes->} - %{info}");

var all48 = all_match({
	processors: [
		part203,
		select57,
		dup106,
		part206,
	],
	on_success: processor_chain([
		dup2,
		dup40,
		setc("event_description","A server side and a client side TCP connection for RNAT are delinked"),
		dup3,
		dup61,
		dup4,
		dup62,
	]),
});

var msg115 = msg("TCP_NAT_OTHERCONN_DELINK", all48);

var part207 = // "Pattern{Constant('User '), Field(username,true), Constant(' - Remote_ip '), Field(saddr,true), Constant(' - Command "login '), Field(fld11,false), Constant('" - Status "Success'), Field(info,false), Constant('"')}"
match("MESSAGE#106:UI_CMD_EXECUTED:Login", "nwparser.payload", "User %{username->} - Remote_ip %{saddr->} - Command \"login %{fld11}\" - Status \"Success%{info}\"", processor_chain([
	dup69,
	dup84,
	dup3,
	dup4,
	dup85,
	dup6,
	dup86,
]));

var msg116 = msg("UI_CMD_EXECUTED:Login", part207);

var part208 = // "Pattern{Constant('User '), Field(username,true), Constant(' - Remote_ip '), Field(saddr,true), Constant(' - Command "login '), Field(fld11,false), Constant('" - Status "ERROR:'), Field(info,false), Constant('"')}"
match("MESSAGE#107:UI_CMD_EXECUTED:LoginFail", "nwparser.payload", "User %{username->} - Remote_ip %{saddr->} - Command \"login %{fld11}\" - Status \"ERROR:%{info}\"", processor_chain([
	dup5,
	dup84,
	dup3,
	dup4,
	setc("disposition","Error"),
	dup6,
	dup86,
]));

var msg117 = msg("UI_CMD_EXECUTED:LoginFail", part208);

var part209 = // "Pattern{Constant('User '), Field(username,true), Constant(' - Remote_ip '), Field(saddr,true), Constant(' - Command "logout '), Field(fld11,false), Constant('" - Status "Success'), Field(info,false), Constant('"')}"
match("MESSAGE#108:UI_CMD_EXECUTED:Logout", "nwparser.payload", "User %{username->} - Remote_ip %{saddr->} - Command \"logout %{fld11}\" - Status \"Success%{info}\"", processor_chain([
	dup71,
	dup84,
	dup3,
	dup4,
	dup85,
	dup72,
	dup87,
]));

var msg118 = msg("UI_CMD_EXECUTED:Logout", part209);

var msg119 = msg("UI_CMD_EXECUTED", dup108);

var part210 = // "Pattern{Constant('User '), Field(username,true), Constant(' - Remote_ip '), Field(saddr,true), Constant(' - Command "login '), Field(fld11,false), Constant('"')}"
match("MESSAGE#144:UI_CMD_EXECUTED:01_Login", "nwparser.payload", "User %{username->} - Remote_ip %{saddr->} - Command \"login %{fld11}\"", processor_chain([
	dup69,
	dup84,
	dup3,
	dup4,
	dup6,
	dup86,
]));

var msg120 = msg("UI_CMD_EXECUTED:01_Login", part210);

var part211 = // "Pattern{Constant('User '), Field(username,true), Constant(' - Remote_ip '), Field(saddr,true), Constant(' - Command "logout '), Field(fld11,false), Constant('"')}"
match("MESSAGE#145:UI_CMD_EXECUTED:01_Logout", "nwparser.payload", "User %{username->} - Remote_ip %{saddr->} - Command \"logout %{fld11}\"", processor_chain([
	dup71,
	dup84,
	dup3,
	dup4,
	dup72,
	dup87,
]));

var msg121 = msg("UI_CMD_EXECUTED:01_Logout", part211);

var part212 = // "Pattern{Constant('User '), Field(username,true), Constant(' - Remote_ip '), Field(saddr,true), Constant(' - Command "'), Field(action,false), Constant('"')}"
match("MESSAGE#146:UI_CMD_EXECUTED:01", "nwparser.payload", "User %{username->} - Remote_ip %{saddr->} - Command \"%{action}\"", processor_chain([
	dup88,
	dup89,
	dup3,
	dup4,
]));

var msg122 = msg("UI_CMD_EXECUTED:01", part212);

var select58 = linear_select([
	msg116,
	msg117,
	msg118,
	msg119,
	msg120,
	msg121,
	msg122,
]);

var part213 = // "Pattern{Field(daddr,false), Constant(':'), Field(dport,true), Constant(' - Source '), Field(saddr,false), Constant(':'), Field(sport,true), Constant(' - Destination '), Field(dtransaddr,false), Constant(':'), Field(dtransport,true), Constant(' - Total_bytes_send '), Field(comp_sbytes,true), Constant(' - Total_bytes_recv '), Field(comp_rbytes,true), Constant(' - Denied_by_policy "'), Field(fld2,false), Constant('" - Group(s) "'), Field(group,false), Constant('"')}"
match("MESSAGE#110:SSLVPN_NONHTTP_RESOURCEACCESS_DENIED/2", "nwparser.p0", "%{daddr}:%{dport->} - Source %{saddr}:%{sport->} - Destination %{dtransaddr}:%{dtransport->} - Total_bytes_send %{comp_sbytes->} - Total_bytes_recv %{comp_rbytes->} - Denied_by_policy \"%{fld2}\" - Group(s) \"%{group}\"");

var all49 = all_match({
	processors: [
		dup73,
		dup105,
		part213,
	],
	on_success: processor_chain([
		dup11,
		dup51,
		dup8,
		dup4,
	]),
});

var msg123 = msg("SSLVPN_NONHTTP_RESOURCEACCESS_DENIED", all49);

var part214 = // "Pattern{Field(fld1,true), Constant(' - State Init')}"
match("MESSAGE#111:EVENT_VRIDINIT", "nwparser.payload", "%{fld1->} - State Init", processor_chain([
	dup9,
	dup4,
]));

var msg124 = msg("EVENT_VRIDINIT", part214);

var part215 = // "Pattern{Constant('"REC: status '), Field(info,true), Constant(' from client '), Field(fld1,true), Constant(' for ID '), Field(id,false), Constant('"')}"
match("MESSAGE#112:CLUSTERD_Message:01", "nwparser.payload", "\"REC: status %{info->} from client %{fld1->} for ID %{id}\"", processor_chain([
	dup9,
	dup4,
]));

var msg125 = msg("CLUSTERD_Message:01", part215);

var part216 = // "Pattern{Field(info,false), Constant('('), Field(saddr,false), Constant(') port('), Field(sport,false), Constant(') msglen('), Field(fld1,false), Constant(') rcv('), Field(packets,false), Constant(') R('), Field(result,false), Constant(') " ')}"
match("MESSAGE#113:CLUSTERD_Message:02/1_0", "nwparser.p0", "%{info}(%{saddr}) port(%{sport}) msglen(%{fld1}) rcv(%{packets}) R(%{result}) \" ");

var select59 = linear_select([
	part216,
	dup90,
]);

var all50 = all_match({
	processors: [
		dup74,
		select59,
	],
	on_success: processor_chain([
		dup9,
		dup4,
	]),
});

var msg126 = msg("CLUSTERD_Message:02", all50);

var select60 = linear_select([
	msg125,
	msg126,
]);

var part217 = // "Pattern{Constant('"crypto: driver '), Field(fld1,true), Constant(' registers alg '), Field(fld2,true), Constant(' flags '), Field(fld3,true), Constant(' maxoplen '), Field(fld4,true), Constant(' "')}"
match("MESSAGE#114:IPSEC_Message/0_0", "nwparser.payload", "\"crypto: driver %{fld1->} registers alg %{fld2->} flags %{fld3->} maxoplen %{fld4->} \"");

var part218 = // "Pattern{Constant(' "'), Field(info,true), Constant(' "')}"
match("MESSAGE#114:IPSEC_Message/0_1", "nwparser.payload", " \"%{info->} \"");

var select61 = linear_select([
	part217,
	part218,
]);

var all51 = all_match({
	processors: [
		select61,
	],
	on_success: processor_chain([
		dup9,
		dup4,
	]),
});

var msg127 = msg("IPSEC_Message", all51);

var part219 = // "Pattern{Constant('"'), Field(event_type,false), Constant(': '), Field(info,true), Constant(' "')}"
match("MESSAGE#115:NSNETSVC_Message", "nwparser.payload", "\"%{event_type}: %{info->} \"", processor_chain([
	dup9,
	dup4,
]));

var msg128 = msg("NSNETSVC_Message", part219);

var part220 = // "Pattern{Field(,true), Constant(' '), Field(username,false), Constant('- Vserver '), Field(daddr,false), Constant(':'), Field(dport,true), Constant(' - Total_bytes_send '), Field(sbytes,true), Constant(' - Remote_host '), Field(hostname,true), Constant(' - Denied_url '), Field(url,true), Constant(' - Denied_by_policy '), Field(policyname,true), Constant(' - Group(s) "'), Field(group,false), Constant('"')}"
match("MESSAGE#116:SSLVPN_HTTP_RESOURCEACCESS_DENIED/2", "nwparser.p0", "%{} %{username}- Vserver %{daddr}:%{dport->} - Total_bytes_send %{sbytes->} - Remote_host %{hostname->} - Denied_url %{url->} - Denied_by_policy %{policyname->} - Group(s) \"%{group}\"");

var all52 = all_match({
	processors: [
		dup48,
		dup104,
		part220,
	],
	on_success: processor_chain([
		dup9,
		dup4,
	]),
});

var msg129 = msg("SSLVPN_HTTP_RESOURCEACCESS_DENIED", all52);

var part221 = // "Pattern{Constant('Client '), Field(saddr,true), Constant(' - Profile '), Field(p0,false)}"
match("MESSAGE#117:NSNETSVC_REQ_PARSE_ERROR/0", "nwparser.payload", "Client %{saddr->} - Profile %{p0}");

var part222 = // "Pattern{Field(info,false), Constant(', '), Field(event_description,true), Constant(' - URL')}"
match("MESSAGE#117:NSNETSVC_REQ_PARSE_ERROR/1_0", "nwparser.p0", "%{info}, %{event_description->} - URL");

var part223 = // "Pattern{Field(info,true), Constant(' - '), Field(event_description,true), Constant(' - URL')}"
match("MESSAGE#117:NSNETSVC_REQ_PARSE_ERROR/1_1", "nwparser.p0", "%{info->} - %{event_description->} - URL");

var select62 = linear_select([
	part222,
	part223,
]);

var all53 = all_match({
	processors: [
		part221,
		select62,
	],
	on_success: processor_chain([
		dup2,
		dup4,
	]),
});

var msg130 = msg("NSNETSVC_REQ_PARSE_ERROR", all53);

var part224 = // "Pattern{Constant('Source '), Field(saddr,false), Constant(':'), Field(sport,true), Constant(' - Vserver '), Field(daddr,false), Constant(':'), Field(dport,true), Constant(' - NatIP '), Field(stransaddr,false), Constant(':'), Field(stransport,true), Constant(' - Destination '), Field(dtransaddr,false), Constant(':'), Field(dtransport,true), Constant(' - Delink Time '), Field(fld11,true), Constant(' '), Field(p0,false)}"
match("MESSAGE#118:Source:01/0", "nwparser.payload", "Source %{saddr}:%{sport->} - Vserver %{daddr}:%{dport->} - NatIP %{stransaddr}:%{stransport->} - Destination %{dtransaddr}:%{dtransport->} - Delink Time %{fld11->} %{p0}");

var part225 = // "Pattern{Constant('GMT - Total_bytes_send '), Field(sbytes,true), Constant(' - Total_bytes_recv '), Field(p0,false)}"
match("MESSAGE#118:Source:01/1_0", "nwparser.p0", "GMT - Total_bytes_send %{sbytes->} - Total_bytes_recv %{p0}");

var part226 = // "Pattern{Constant('- Total_bytes_send '), Field(sbytes,true), Constant(' - Total_bytes_recv '), Field(p0,false)}"
match("MESSAGE#118:Source:01/1_1", "nwparser.p0", "- Total_bytes_send %{sbytes->} - Total_bytes_recv %{p0}");

var part227 = // "Pattern{Constant('GMT Total_bytes_send '), Field(sbytes,true), Constant(' - Total_bytes_recv '), Field(p0,false)}"
match("MESSAGE#118:Source:01/1_2", "nwparser.p0", "GMT Total_bytes_send %{sbytes->} - Total_bytes_recv %{p0}");

var part228 = // "Pattern{Constant('Total_bytes_send '), Field(sbytes,true), Constant(' - Total_bytes_recv '), Field(p0,false)}"
match("MESSAGE#118:Source:01/1_3", "nwparser.p0", "Total_bytes_send %{sbytes->} - Total_bytes_recv %{p0}");

var select63 = linear_select([
	part225,
	part226,
	part227,
	part228,
]);

var part229 = // "Pattern{Field(rbytes,false)}"
match_copy("MESSAGE#118:Source:01/2", "nwparser.p0", "rbytes");

var all54 = all_match({
	processors: [
		part224,
		select63,
		part229,
	],
	on_success: processor_chain([
		dup2,
		dup79,
	]),
});

var msg131 = msg("Source:01", all54);

var all55 = all_match({
	processors: [
		dup80,
		dup107,
		dup106,
		dup78,
	],
	on_success: processor_chain([
		dup2,
		dup61,
		dup62,
	]),
});

var msg132 = msg("Source:02", all55);

var select64 = linear_select([
	msg131,
	msg132,
]);

var part230 = // "Pattern{Constant('User '), Field(username,true), Constant(' - Remote_ip '), Field(saddr,true), Constant(' - Command "'), Field(fld1,false), Constant('" - Status "'), Field(result,false), Constant('"')}"
match("MESSAGE#120:User", "nwparser.payload", "User %{username->} - Remote_ip %{saddr->} - Command \"%{fld1}\" - Status \"%{result}\"", processor_chain([
	dup2,
]));

var msg133 = msg("User", part230);

var part231 = // "Pattern{Constant('SPCBId '), Field(sessionid,true), Constant(' - ClientIP '), Field(saddr,true), Constant(' - ClientPort '), Field(sport,true), Constant(' - VserverServiceIP '), Field(daddr,true), Constant(' - VserverServicePort '), Field(dport,true), Constant(' - ClientVersion '), Field(s_sslver,true), Constant(' - CipherSuite "'), Field(s_cipher,false), Constant('" - '), Field(result,false)}"
match("MESSAGE#121:SPCBId", "nwparser.payload", "SPCBId %{sessionid->} - ClientIP %{saddr->} - ClientPort %{sport->} - VserverServiceIP %{daddr->} - VserverServicePort %{dport->} - ClientVersion %{s_sslver->} - CipherSuite \"%{s_cipher}\" - %{result}", processor_chain([
	dup11,
	dup40,
	dup8,
	dup41,
]));

var msg134 = msg("SPCBId", part231);

var msg135 = msg("APPFW_COOKIE", dup109);

var msg136 = msg("APPFW_CSRF_TAG", dup109);

var msg137 = msg("APPFW_STARTURL", dup109);

var msg138 = msg("APPFW_FIELDCONSISTENCY", dup109);

var msg139 = msg("APPFW_REFERER_HEADER", dup109);

var part232 = // "Pattern{Field(product,false), Constant('|'), Field(version,false), Constant('|'), Field(rule,false), Constant('|'), Field(fld1,false), Constant('|'), Field(severity,false), Constant('|src='), Field(saddr,true), Constant(' spt='), Field(sport,true), Constant(' method='), Field(web_method,true), Constant(' request='), Field(url,true), Constant(' msg='), Field(info,true), Constant(' cn1='), Field(fld2,true), Constant(' cn2='), Field(fld3,true), Constant(' cs1='), Field(policyname,true), Constant(' cs2='), Field(fld5,true), Constant(' cs3='), Field(fld6,true), Constant(' cs4='), Field(severity,true), Constant(' cs5='), Field(fld8,true), Constant(' cs6='), Field(fld9,true), Constant(' act='), Field(action,false)}"
match("MESSAGE#127:APPFW_SIGNATURE_MATCH", "nwparser.payload", "%{product}|%{version}|%{rule}|%{fld1}|%{severity}|src=%{saddr->} spt=%{sport->} method=%{web_method->} request=%{url->} msg=%{info->} cn1=%{fld2->} cn2=%{fld3->} cs1=%{policyname->} cs2=%{fld5->} cs3=%{fld6->} cs4=%{severity->} cs5=%{fld8->} cs6=%{fld9->} act=%{action}", processor_chain([
	dup9,
	dup91,
]));

var msg140 = msg("APPFW_SIGNATURE_MATCH", part232);

var msg141 = msg("AF_400_RESP", dup110);

var msg142 = msg("AF_MALFORMED_REQ_ERR", dup110);

var part233 = tagval("MESSAGE#130:CITRIX_TVM", "nwparser.payload", tvm, {
	"act": "action",
	"cn1": "fld2",
	"cn2": "fld3",
	"cs1": "policyname",
	"cs2": "fld5",
	"cs4": "severity",
	"cs5": "fld8",
	"method": "web_method",
	"msg": "info",
	"request": "url",
	"spt": "sport",
	"src": "saddr",
}, processor_chain([
	dup11,
	dup91,
	setf("vid","hfld1"),
	setf("msg_id","hfld1"),
	lookup({
		dest: "nwparser.event_cat",
		map: map_getEventLegacyCategory,
		key: field("action"),
	}),
	lookup({
		dest: "nwparser.event_cat_name",
		map: map_getEventLegacyCategoryName,
		key: field("event_cat"),
	}),
]));

var msg143 = msg("CITRIX_TVM", part233);

var part234 = // "Pattern{Field(saddr,true), Constant(' '), Field(fld1,true), Constant(' '), Field(fld2,true), Constant(' '), Field(fld3,true), Constant(' '), Field(url,true), Constant(' '), Field(event_description,false)}"
match("MESSAGE#131:APPFW_APPFW_POLICY_HIT", "nwparser.payload", "%{saddr->} %{fld1->} %{fld2->} %{fld3->} %{url->} %{event_description}", processor_chain([
	dup9,
	dup40,
	dup3,
	dup4,
]));

var msg144 = msg("APPFW_APPFW_POLICY_HIT", part234);

var part235 = // "Pattern{Field(saddr,true), Constant(' '), Field(fld1,true), Constant(' '), Field(fld2,true), Constant(' '), Field(rule_group,true), Constant(' '), Field(url,true), Constant(' Unknown content-type header value='), Field(fld4,true), Constant(' '), Field(info,true), Constant(' <<'), Field(disposition,false), Constant('>')}"
match("MESSAGE#132:APPFW_APPFW_CONTENT_TYPE", "nwparser.payload", "%{saddr->} %{fld1->} %{fld2->} %{rule_group->} %{url->} Unknown content-type header value=%{fld4->} %{info->} \u003c\u003c%{disposition}>", processor_chain([
	dup9,
	dup91,
	dup4,
]));

var msg145 = msg("APPFW_APPFW_CONTENT_TYPE", part235);

var part236 = // "Pattern{Field(saddr,true), Constant(' '), Field(fld1,true), Constant(' '), Field(fld2,true), Constant(' '), Field(rule_group,true), Constant(' '), Field(url,true), Constant(' WSI check failed: '), Field(fld4,false), Constant(': '), Field(info,true), Constant(' <<'), Field(disposition,false), Constant('>')}"
match("MESSAGE#133:APPFW_RESP_APPFW_XML_WSI_ERR_BODY_ENV_NAMESPACE", "nwparser.payload", "%{saddr->} %{fld1->} %{fld2->} %{rule_group->} %{url->} WSI check failed: %{fld4}: %{info->} \u003c\u003c%{disposition}>", processor_chain([
	dup9,
	dup91,
	dup4,
]));

var msg146 = msg("APPFW_RESP_APPFW_XML_WSI_ERR_BODY_ENV_NAMESPACE", part236);

var part237 = // "Pattern{Field(saddr,true), Constant(' '), Field(fld2,true), Constant(' '), Field(fld3,true), Constant(' '), Field(rule_group,true), Constant(' '), Field(url,true), Constant(' Referer header check failed: referer header URL ''), Field(web_referer,false), Constant('' not in Start URL or closure list <<'), Field(disposition,false), Constant('>')}"
match("MESSAGE#134:APPFW_APPFW_REFERER_HEADER", "nwparser.payload", "%{saddr->} %{fld2->} %{fld3->} %{rule_group->} %{url->} Referer header check failed: referer header URL '%{web_referer}' not in Start URL or closure list \u003c\u003c%{disposition}>", processor_chain([
	dup9,
	dup40,
	dup3,
	dup4,
	setc("event_description","referer header URL not in Start URL or closure list"),
]));

var msg147 = msg("APPFW_APPFW_REFERER_HEADER", part237);

var part238 = // "Pattern{Constant('"URL'), Field(url,false), Constant('Client IP'), Field(hostip,false), Constant('Client Dest'), Field(fld1,false)}"
match("MESSAGE#141:RESPONDER_Message", "nwparser.payload", "\"URL%{url}Client IP%{hostip}Client Dest%{fld1}", processor_chain([
	dup9,
	dup3,
	dup4,
]));

var msg148 = msg("RESPONDER_Message", part238);

var part239 = // "Pattern{Constant('"NSRateLimit='), Field(filter,false), Constant(', ClientIP='), Field(saddr,false), Constant('"')}"
match("MESSAGE#142:RESPONDER_Message:01", "nwparser.payload", "\"NSRateLimit=%{filter}, ClientIP=%{saddr}\"", processor_chain([
	dup9,
	dup3,
	dup4,
]));

var msg149 = msg("RESPONDER_Message:01", part239);

var select65 = linear_select([
	msg148,
	msg149,
]);

var part240 = // "Pattern{Field(saddr,true), Constant(' '), Field(fld1,true), Constant(' - '), Field(fld2,true), Constant(' - '), Field(event_description,true), Constant(' <<'), Field(disposition,false), Constant('>')}"
match("MESSAGE#147:APPFW_AF_MALFORMED_REQ_ERR", "nwparser.payload", "%{saddr->} %{fld1->} - %{fld2->} - %{event_description->} \u003c\u003c%{disposition}>", processor_chain([
	dup11,
	dup3,
	dup4,
]));

var msg150 = msg("APPFW_AF_MALFORMED_REQ_ERR", part240);

var part241 = // "Pattern{Field(saddr,true), Constant(' '), Field(fld1,true), Constant(' - '), Field(fld2,true), Constant(' - '), Field(rule_group,true), Constant(' '), Field(url,true), Constant(' '), Field(event_description,true), Constant(' rule ID '), Field(rule_uid,false), Constant(': '), Field(info,true), Constant(' <<'), Field(disposition,false), Constant('>')}"
match("MESSAGE#148:APPFW_APPFW_SIGNATURE_MATCH", "nwparser.payload", "%{saddr->} %{fld1->} - %{fld2->} - %{rule_group->} %{url->} %{event_description->} rule ID %{rule_uid}: %{info->} \u003c\u003c%{disposition}>", processor_chain([
	dup9,
	domain("web_domain","url"),
	root("web_root","url"),
	page("webpage","url"),
	setf("filename","webpage"),
	dup3,
	dup4,
]));

var msg151 = msg("APPFW_APPFW_SIGNATURE_MATCH", part241);

var part242 = // "Pattern{Field(saddr,true), Constant(' '), Field(fld1,true), Constant(' '), Field(fld2,true), Constant(' '), Field(rule_group,true), Constant(' '), Field(url,true), Constant(' Signature violation rule ID '), Field(rule_uid,false), Constant(': '), Field(info,true), Constant(' <<'), Field(disposition,false), Constant('>')}"
match("MESSAGE#149:APPFW_APPFW_SIGNATURE_MATCH:01", "nwparser.payload", "%{saddr->} %{fld1->} %{fld2->} %{rule_group->} %{url->} Signature violation rule ID %{rule_uid}: %{info->} \u003c\u003c%{disposition}>", processor_chain([
	dup9,
	dup91,
	dup4,
	setc("event_description","Signature violation"),
]));

var msg152 = msg("APPFW_APPFW_SIGNATURE_MATCH:01", part242);

var select66 = linear_select([
	msg151,
	msg152,
]);

var part243 = // "Pattern{Constant('User '), Field(username,true), Constant(' - Remote_ip '), Field(saddr,true), Constant(' - Command "'), Field(action,false), Constant('" -serverIP '), Field(daddr,true), Constant(' -serverPort '), Field(dport,true), Constant(' -logLevel '), Field(fld1,true), Constant(' -dateFormat '), Field(fld2,true), Constant(' -logFacility '), Field(fld3,true), Constant(' -tcp '), Field(fld4,true), Constant(' -acl '), Field(fld5,true), Constant(' -timeZone '), Field(fld6,true), Constant(' -userDefinedAuditlog '), Field(fld7,true), Constant(' -appflowExport '), Field(fld8,false), Constant('" - Status "'), Field(disposition,false), Constant('"')}"
match("MESSAGE#150:GUI_CMD_EXECUTED:01", "nwparser.payload", "User %{username->} - Remote_ip %{saddr->} - Command \"%{action}\" -serverIP %{daddr->} -serverPort %{dport->} -logLevel %{fld1->} -dateFormat %{fld2->} -logFacility %{fld3->} -tcp %{fld4->} -acl %{fld5->} -timeZone %{fld6->} -userDefinedAuditlog %{fld7->} -appflowExport %{fld8}\" - Status \"%{disposition}\"", processor_chain([
	dup88,
	dup89,
	dup3,
	dup4,
]));

var msg153 = msg("GUI_CMD_EXECUTED:01", part243);

var part244 = // "Pattern{Constant('User '), Field(username,true), Constant(' - Remote_ip '), Field(saddr,true), Constant(' - Command "'), Field(action,true), Constant(' -priority '), Field(fld1,true), Constant(' -devno '), Field(fld2,false), Constant('" - Status "'), Field(disposition,false), Constant('"')}"
match("MESSAGE#151:GUI_CMD_EXECUTED:02", "nwparser.payload", "User %{username->} - Remote_ip %{saddr->} - Command \"%{action->} -priority %{fld1->} -devno %{fld2}\" - Status \"%{disposition}\"", processor_chain([
	dup88,
	dup89,
	dup3,
	dup4,
]));

var msg154 = msg("GUI_CMD_EXECUTED:02", part244);

var part245 = // "Pattern{Constant('User '), Field(username,true), Constant(' - Remote_ip '), Field(saddr,true), Constant(' - Command "login '), Field(fld11,false), Constant('" - Status "Success'), Field(info,false), Constant('"')}"
match("MESSAGE#152:GUI_CMD_EXECUTED:Login", "nwparser.payload", "User %{username->} - Remote_ip %{saddr->} - Command \"login %{fld11}\" - Status \"Success%{info}\"", processor_chain([
	dup69,
	dup92,
	dup3,
	dup4,
	dup85,
	dup6,
	dup86,
]));

var msg155 = msg("GUI_CMD_EXECUTED:Login", part245);

var part246 = // "Pattern{Constant('User '), Field(username,true), Constant(' - Remote_ip '), Field(saddr,true), Constant(' - Command "logout '), Field(fld11,false), Constant('" - Status "Success'), Field(info,false), Constant('"')}"
match("MESSAGE#153:GUI_CMD_EXECUTED:Logout", "nwparser.payload", "User %{username->} - Remote_ip %{saddr->} - Command \"logout %{fld11}\" - Status \"Success%{info}\"", processor_chain([
	dup71,
	dup92,
	dup3,
	dup4,
	dup85,
	dup72,
	dup87,
]));

var msg156 = msg("GUI_CMD_EXECUTED:Logout", part246);

var msg157 = msg("GUI_CMD_EXECUTED", dup108);

var part247 = // "Pattern{Constant('User '), Field(username,true), Constant(' - Remote_ip '), Field(saddr,true), Constant(' - Command "'), Field(action,true), Constant(' - Status "'), Field(disposition,false), Constant('" - Message "'), Field(info,false), Constant('"')}"
match("MESSAGE#155:GUI_CMD_EXECUTED:03", "nwparser.payload", "User %{username->} - Remote_ip %{saddr->} - Command \"%{action->} - Status \"%{disposition}\" - Message \"%{info}\"", processor_chain([
	dup88,
	dup89,
	dup4,
]));

var msg158 = msg("GUI_CMD_EXECUTED:03", part247);

var select67 = linear_select([
	msg153,
	msg154,
	msg155,
	msg156,
	msg157,
	msg158,
]);

var msg159 = msg("CLI_CMD_EXECUTED", dup108);

var part248 = // "Pattern{Constant('User '), Field(username,true), Constant(' - Remote_ip '), Field(saddr,true), Constant(' - Command "'), Field(action,false), Constant('" - Status "'), Field(disposition,false), Constant('"')}"
match("MESSAGE#157:API_CMD_EXECUTED", "nwparser.payload", "User %{username->} - Remote_ip %{saddr->} - Command \"%{action}\" - Status \"%{disposition}\"", processor_chain([
	dup88,
	setc("event_description","API command executed in NetScaler"),
	dup3,
	dup4,
]));

var msg160 = msg("API_CMD_EXECUTED", part248);

var part249 = // "Pattern{Field(result,true), Constant(' for user '), Field(username,true), Constant(' = '), Field(fld1,true), Constant(' "')}"
match("MESSAGE#158:AAA_Message/1_0", "nwparser.p0", "%{result->} for user %{username->} = %{fld1->} \"");

var part250 = // "Pattern{Constant(''), Field(info,true), Constant(' "')}"
match("MESSAGE#158:AAA_Message/1_1", "nwparser.p0", "%{info->} \"");

var select68 = linear_select([
	part249,
	part250,
]);

var all56 = all_match({
	processors: [
		dup93,
		select68,
	],
	on_success: processor_chain([
		dup9,
		dup4,
	]),
});

var msg161 = msg("AAA_Message", all56);

var part251 = // "Pattern{Constant('"'), Field(event_type,false), Constant(': created session for <<'), Field(domain,false), Constant('> with cookie: <<'), Field(web_cookie,false), Constant('>"')}"
match("MESSAGE#159:AAATM_Message:04", "nwparser.payload", "\"%{event_type}: created session for \u003c\u003c%{domain}> with cookie: \u003c\u003c%{web_cookie}>\"", processor_chain([
	dup9,
	dup91,
	dup4,
]));

var msg162 = msg("AAATM_Message:04", part251);

var part252 = // "Pattern{Field(fld1,true), Constant(' for user '), Field(username,true), Constant(' "')}"
match("MESSAGE#160:AAATM_Message/1_0", "nwparser.p0", "%{fld1->} for user %{username->} \"");

var select69 = linear_select([
	part252,
	dup90,
]);

var all57 = all_match({
	processors: [
		dup93,
		select69,
	],
	on_success: processor_chain([
		dup9,
		dup4,
	]),
});

var msg163 = msg("AAATM_Message", all57);

var part253 = // "Pattern{Constant('"'), Field(fld1,true), Constant(' creating session '), Field(info,false), Constant('"')}"
match("MESSAGE#161:AAATM_Message:01", "nwparser.payload", "\"%{fld1->} creating session %{info}\"", processor_chain([
	dup9,
	dup4,
	setc("event_type","creating session"),
]));

var msg164 = msg("AAATM_Message:01", part253);

var part254 = // "Pattern{Constant('"cookie idx is '), Field(fld1,false), Constant(', '), Field(info,false), Constant('"')}"
match("MESSAGE#162:AAATM_Message:02", "nwparser.payload", "\"cookie idx is %{fld1}, %{info}\"", processor_chain([
	dup9,
	dup4,
	setc("event_type","cookie idx"),
]));

var msg165 = msg("AAATM_Message:02", part254);

var part255 = // "Pattern{Constant('"sent request to '), Field(fld1,true), Constant(' for authentication, user <<'), Field(domain,false), Constant('\'), Field(username,false), Constant('>, client ip '), Field(saddr,false), Constant('"')}"
match("MESSAGE#163:AAATM_Message:03", "nwparser.payload", "\"sent request to %{fld1->} for authentication, user \u003c\u003c%{domain}\\%{username}>, client ip %{saddr}\"", processor_chain([
	setc("eventcategory","1304000000"),
	dup4,
	setc("event_type","sent request"),
]));

var msg166 = msg("AAATM_Message:03", part255);

var part256 = // "Pattern{Constant('"authentication succeeded for user <<'), Field(domain,false), Constant('\'), Field(username,false), Constant('>, client ip '), Field(saddr,false), Constant(', setting up session"')}"
match("MESSAGE#164:AAATM_Message:05", "nwparser.payload", "\"authentication succeeded for user \u003c\u003c%{domain}\\%{username}>, client ip %{saddr}, setting up session\"", processor_chain([
	setc("eventcategory","1302000000"),
	dup4,
	setc("event_type","setting up session"),
]));

var msg167 = msg("AAATM_Message:05", part256);

var msg168 = msg("AAATM_Message:06", dup111);

var select70 = linear_select([
	msg162,
	msg163,
	msg164,
	msg165,
	msg166,
	msg167,
	msg168,
]);

var part257 = // "Pattern{Constant('Context '), Field(fld1,true), Constant(' - SessionId: '), Field(sessionid,false), Constant('- '), Field(event_computer,true), Constant(' User '), Field(username,true), Constant(' : Group(s) '), Field(group,true), Constant(' : Vserver '), Field(daddr,false), Constant(':'), Field(dport,true), Constant(' - '), Field(fld2,true), Constant(' '), Field(p0,false)}"
match("MESSAGE#166:AAATM_HTTPREQUEST/0", "nwparser.payload", "Context %{fld1->} - SessionId: %{sessionid}- %{event_computer->} User %{username->} : Group(s) %{group->} : Vserver %{daddr}:%{dport->} - %{fld2->} %{p0}");

var part258 = // "Pattern{Field(timezone,false), Constant(': SSO is '), Field(fld3,true), Constant(' : '), Field(p0,false)}"
match("MESSAGE#166:AAATM_HTTPREQUEST/1_0", "nwparser.p0", "%{timezone}: SSO is %{fld3->} : %{p0}");

var part259 = // "Pattern{Field(timezone,true), Constant(' '), Field(p0,false)}"
match("MESSAGE#166:AAATM_HTTPREQUEST/1_1", "nwparser.p0", "%{timezone->} %{p0}");

var select71 = linear_select([
	part258,
	part259,
]);

var part260 = // "Pattern{Field(web_method,true), Constant(' '), Field(url,true), Constant(' '), Field(fld4,false)}"
match("MESSAGE#166:AAATM_HTTPREQUEST/2", "nwparser.p0", "%{web_method->} %{url->} %{fld4}");

var all58 = all_match({
	processors: [
		part257,
		select71,
		part260,
	],
	on_success: processor_chain([
		dup9,
		dup4,
		date_time({
			dest: "effective_time",
			args: ["fld2"],
			fmts: [
				[dG,dc("/"),dF,dc("/"),dW,dc(":"),dH,dc(":"),dU,dc(":"),dO],
			],
		}),
		setc("event_description","AAATM HTTP Request"),
	]),
});

var msg169 = msg("AAATM_HTTPREQUEST", all58);

var msg170 = msg("SSLVPN_REMOVE_SESSION_ERR", dup114);

var msg171 = msg("SSLVPN_REMOVE_SESSION", dup114);

var msg172 = msg("SSLVPN_REMOVE_SESSION_INFO", dup114);

var part261 = // "Pattern{Constant('session_guid '), Field(fld1,true), Constant(' - device_serial_number '), Field(fld2,true), Constant(' - client_cookie '), Field(fld3,true), Constant(' - flags '), Field(fld4,true), Constant(' - ica_rtt '), Field(fld5,true), Constant(' - clientside_rxbytes '), Field(rbytes,false), Constant('- clientside_txbytes '), Field(sbytes,true), Constant(' - clientside_packet_retransmits '), Field(fld6,true), Constant(' - serverside_packet_retransmits '), Field(fld7,true), Constant(' - clientside_rtt '), Field(fld8,true), Constant(' - serverside_rtt '), Field(fld9,true), Constant(' - clientside_jitter '), Field(fld10,true), Constant(' - serverside_jitter '), Field(fld11,false)}"
match("MESSAGE#170:ICA_NETWORK_UPDATE", "nwparser.payload", "session_guid %{fld1->} - device_serial_number %{fld2->} - client_cookie %{fld3->} - flags %{fld4->} - ica_rtt %{fld5->} - clientside_rxbytes %{rbytes}- clientside_txbytes %{sbytes->} - clientside_packet_retransmits %{fld6->} - serverside_packet_retransmits %{fld7->} - clientside_rtt %{fld8->} - serverside_rtt %{fld9->} - clientside_jitter %{fld10->} - serverside_jitter %{fld11}", processor_chain([
	dup9,
	dup4,
]));

var msg173 = msg("ICA_NETWORK_UPDATE", part261);

var part262 = // "Pattern{Constant('session_guid '), Field(fld1,true), Constant(' - device_serial_number '), Field(fld2,true), Constant(' - client_cookie '), Field(fld3,true), Constant(' - flags '), Field(fld4,true), Constant(' - channel_update_begin '), Field(fld5,true), Constant(' - channel_update_end '), Field(fld6,true), Constant(' - channel_id_1 '), Field(fld7,true), Constant(' - channel_id_1_val '), Field(fld8,true), Constant(' - channel_id_2 '), Field(fld9,true), Constant(' - channel_id_2_val '), Field(fld10,true), Constant(' -channel_id_3 '), Field(fld11,true), Constant(' - channel_id_3_val '), Field(fld12,true), Constant(' - channel_id_4 '), Field(fld13,true), Constant(' - channel_id_4_val '), Field(fld14,true), Constant(' -channel_id_5 '), Field(fld15,true), Constant(' - channel_id_5_val '), Field(fld16,false)}"
match("MESSAGE#171:ICA_CHANNEL_UPDATE", "nwparser.payload", "session_guid %{fld1->} - device_serial_number %{fld2->} - client_cookie %{fld3->} - flags %{fld4->} - channel_update_begin %{fld5->} - channel_update_end %{fld6->} - channel_id_1 %{fld7->} - channel_id_1_val %{fld8->} - channel_id_2 %{fld9->} - channel_id_2_val %{fld10->} -channel_id_3 %{fld11->} - channel_id_3_val %{fld12->} - channel_id_4 %{fld13->} - channel_id_4_val %{fld14->} -channel_id_5 %{fld15->} - channel_id_5_val %{fld16}", processor_chain([
	dup9,
	date_time({
		dest: "starttime",
		args: ["fld5"],
		fmts: [
			[dG,dc("/"),dF,dc("/"),dW,dc(":"),dH,dc(":"),dU,dc(":"),dO],
		],
	}),
	date_time({
		dest: "endtime",
		args: ["fld6"],
		fmts: [
			[dG,dc("/"),dF,dc("/"),dW,dc(":"),dH,dc(":"),dU,dc(":"),dO],
		],
	}),
	dup4,
]));

var msg174 = msg("ICA_CHANNEL_UPDATE", part262);

var part263 = // "Pattern{Constant('session_guid '), Field(fld1,true), Constant(' - device_serial_number '), Field(fld2,true), Constant(' - client_cookie '), Field(fld3,true), Constant(' - flags '), Field(fld4,true), Constant(' - nsica_session_status '), Field(fld5,true), Constant(' - nsica_session_client_ip '), Field(saddr,true), Constant(' - nsica_session_client_port '), Field(sport,true), Constant(' - nsica_session_server_ip '), Field(daddr,true), Constant(' - nsica_session_server_port '), Field(dport,true), Constant(' - nsica_session_reconnect_count '), Field(fld6,true), Constant(' - nsica_session_acr_count '), Field(fld7,true), Constant(' - connection_priority '), Field(fld8,true), Constant(' - timestamp '), Field(fld9,false)}"
match("MESSAGE#172:ICA_SESSION_UPDATE", "nwparser.payload", "session_guid %{fld1->} - device_serial_number %{fld2->} - client_cookie %{fld3->} - flags %{fld4->} - nsica_session_status %{fld5->} - nsica_session_client_ip %{saddr->} - nsica_session_client_port %{sport->} - nsica_session_server_ip %{daddr->} - nsica_session_server_port %{dport->} - nsica_session_reconnect_count %{fld6->} - nsica_session_acr_count %{fld7->} - connection_priority %{fld8->} - timestamp %{fld9}", processor_chain([
	dup9,
	dup4,
]));

var msg175 = msg("ICA_SESSION_UPDATE", part263);

var msg176 = msg("ICA_Message", dup111);

var part264 = // "Pattern{Constant('session_guid '), Field(fld1,true), Constant(' - device_serial_number '), Field(fld2,true), Constant(' - client_cookie '), Field(fld3,true), Constant(' - flags '), Field(fld4,true), Constant(' - session_setup_time '), Field(fld5,true), Constant(' - client_ip '), Field(saddr,true), Constant(' - client_type '), Field(fld6,true), Constant(' - client_launcher '), Field(fld7,true), Constant(' - client_version '), Field(version,true), Constant(' - client_hostname '), Field(shost,true), Constant(' - domain_name '), Field(domain,true), Constant(' - server_name '), Field(dhost,true), Constant(' - connection_priority '), Field(fld8,false)}"
match("MESSAGE#174:ICA_SESSION_SETUP", "nwparser.payload", "session_guid %{fld1->} - device_serial_number %{fld2->} - client_cookie %{fld3->} - flags %{fld4->} - session_setup_time %{fld5->} - client_ip %{saddr->} - client_type %{fld6->} - client_launcher %{fld7->} - client_version %{version->} - client_hostname %{shost->} - domain_name %{domain->} - server_name %{dhost->} - connection_priority %{fld8}", processor_chain([
	dup9,
	dup4,
]));

var msg177 = msg("ICA_SESSION_SETUP", part264);

var part265 = // "Pattern{Constant('session_guid '), Field(fld1,true), Constant(' - device_serial_number '), Field(fld2,true), Constant(' - client_cookie '), Field(fld3,true), Constant(' - flags '), Field(fld4,true), Constant(' - launch_mechanism '), Field(fld5,true), Constant(' - app_launch_time '), Field(fld6,true), Constant(' - app_process_id '), Field(fld7,true), Constant(' - app_name '), Field(fld8,true), Constant(' - module_path '), Field(filename,false)}"
match("MESSAGE#175:ICA_APPLICATION_LAUNCH", "nwparser.payload", "session_guid %{fld1->} - device_serial_number %{fld2->} - client_cookie %{fld3->} - flags %{fld4->} - launch_mechanism %{fld5->} - app_launch_time %{fld6->} - app_process_id %{fld7->} - app_name %{fld8->} - module_path %{filename}", processor_chain([
	dup9,
	date_time({
		dest: "starttime",
		args: ["fld6"],
		fmts: [
			[dG,dc("/"),dF,dc("/"),dW,dc(":"),dH,dc(":"),dU,dc(":"),dO],
		],
	}),
	dup4,
]));

var msg178 = msg("ICA_APPLICATION_LAUNCH", part265);

var part266 = // "Pattern{Constant('session_guid '), Field(fld1,true), Constant(' - device_serial_number '), Field(fld2,true), Constant(' - client_cookie '), Field(fld3,true), Constant(' - flags '), Field(fld4,true), Constant(' - session_end_time '), Field(fld5,false)}"
match("MESSAGE#176:ICA_SESSION_TERMINATE", "nwparser.payload", "session_guid %{fld1->} - device_serial_number %{fld2->} - client_cookie %{fld3->} - flags %{fld4->} - session_end_time %{fld5}", processor_chain([
	dup9,
	date_time({
		dest: "endtime",
		args: ["fld5"],
		fmts: [
			[dG,dc("/"),dF,dc("/"),dW,dc(":"),dH,dc(":"),dU,dc(":"),dO],
		],
	}),
	dup4,
]));

var msg179 = msg("ICA_SESSION_TERMINATE", part266);

var part267 = // "Pattern{Constant('session_guid '), Field(fld1,true), Constant(' - device_serial_number '), Field(fld2,true), Constant(' - client_cookie '), Field(fld3,true), Constant(' - flags '), Field(fld4,true), Constant(' - app_termination_type '), Field(fld5,true), Constant(' - app_process_id '), Field(fld6,true), Constant(' - app_termination_time '), Field(fld7,false)}"
match("MESSAGE#177:ICA_APPLICATION_TERMINATE", "nwparser.payload", "session_guid %{fld1->} - device_serial_number %{fld2->} - client_cookie %{fld3->} - flags %{fld4->} - app_termination_type %{fld5->} - app_process_id %{fld6->} - app_termination_time %{fld7}", processor_chain([
	dup9,
	date_time({
		dest: "endtime",
		args: ["fld7"],
		fmts: [
			[dG,dc("/"),dF,dc("/"),dW,dc(":"),dH,dc(":"),dU,dc(":"),dO],
		],
	}),
	dup4,
]));

var msg180 = msg("ICA_APPLICATION_TERMINATE", part267);

var all59 = all_match({
	processors: [
		dup94,
		dup112,
		dup97,
	],
	on_success: processor_chain([
		setc("eventcategory","1801010100"),
		dup4,
	]),
});

var msg181 = msg("SSLVPN_REMOVE_SESSION_DEBUG", all59);

var part268 = // "Pattern{Field(daddr,false), Constant(':'), Field(dport,true), Constant(' - Browser_type '), Field(user_agent,false), Constant('- Group(s) "'), Field(group,false), Constant('"')}"
match("MESSAGE#181:AAATM_LOGIN/4", "nwparser.p0", "%{daddr}:%{dport->} - Browser_type %{user_agent}- Group(s) \"%{group}\"");

var all60 = all_match({
	processors: [
		dup48,
		dup104,
		dup66,
		dup105,
		part268,
	],
	on_success: processor_chain([
		dup69,
		dup6,
		dup7,
		dup4,
	]),
});

var msg182 = msg("AAATM_LOGIN", all60);

var part269 = // "Pattern{Field(duration_string,true), Constant(' - Http_resources_accessed '), Field(fld3,true), Constant(' - Total_TCP_connections '), Field(fld5,true), Constant(' - Total_policies_allowed '), Field(fld7,true), Constant(' - Total_policies_denied '), Field(fld8,true), Constant(' - Total_bytes_send '), Field(sbytes,true), Constant(' - Total_bytes_recv '), Field(rbytes,true), Constant(' - Total_compressedbytes_send '), Field(fld12,true), Constant(' - Total_compressedbytes_recv '), Field(fld13,true), Constant(' - Compression_ratio_send '), Field(dclass_ratio1,true), Constant(' - Compression_ratio_recv '), Field(dclass_ratio2,true), Constant(' - LogoutMethod "'), Field(result,false), Constant('" - Group(s) "'), Field(group,false), Constant('"')}"
match("MESSAGE#182:AAATM_LOGOUT/7", "nwparser.p0", "%{duration_string->} - Http_resources_accessed %{fld3->} - Total_TCP_connections %{fld5->} - Total_policies_allowed %{fld7->} - Total_policies_denied %{fld8->} - Total_bytes_send %{sbytes->} - Total_bytes_recv %{rbytes->} - Total_compressedbytes_send %{fld12->} - Total_compressedbytes_recv %{fld13->} - Compression_ratio_send %{dclass_ratio1->} - Compression_ratio_recv %{dclass_ratio2->} - LogoutMethod \"%{result}\" - Group(s) \"%{group}\"");

var all61 = all_match({
	processors: [
		dup48,
		dup104,
		dup66,
		dup105,
		dup70,
		dup102,
		dup103,
		part269,
	],
	on_success: processor_chain([
		dup71,
		dup72,
		dup7,
		dup4,
		dup59,
		dup60,
		dup61,
		dup62,
	]),
});

var msg183 = msg("AAATM_LOGOUT", all61);

var msg184 = msg("EVENT_LOGINFAILURE", dup101);

var chain1 = processor_chain([
	select2,
	msgid_select({
		"AAATM_HTTPREQUEST": msg169,
		"AAATM_LOGIN": msg182,
		"AAATM_LOGOUT": msg183,
		"AAATM_Message": select70,
		"AAA_EXTRACTED_GROUPS": msg1,
		"AAA_LOGIN_FAILED": msg2,
		"AAA_Message": msg161,
		"ACL_ACL_PKT_LOG": msg3,
		"AF_400_RESP": msg141,
		"AF_MALFORMED_REQ_ERR": msg142,
		"API_CMD_EXECUTED": msg160,
		"APPFW_AF_400_RESP": select16,
		"APPFW_AF_MALFORMED_REQ_ERR": msg150,
		"APPFW_AF_MEMORY_ERR": msg23,
		"APPFW_APPFW_BUFFEROVERFLOW_COOKIE": msg4,
		"APPFW_APPFW_BUFFEROVERFLOW_HDR": msg5,
		"APPFW_APPFW_BUFFEROVERFLOW_URL": select4,
		"APPFW_APPFW_CONTENT_TYPE": msg145,
		"APPFW_APPFW_COOKIE": msg8,
		"APPFW_APPFW_CSRF_TAG": select17,
		"APPFW_APPFW_DENYURL": msg9,
		"APPFW_APPFW_FIELDCONSISTENCY": msg10,
		"APPFW_APPFW_FIELDFORMAT": msg11,
		"APPFW_APPFW_POLICY_HIT": msg144,
		"APPFW_APPFW_REFERER_HEADER": msg147,
		"APPFW_APPFW_SAFECOMMERCE": msg14,
		"APPFW_APPFW_SAFECOMMERCE_XFORM": msg15,
		"APPFW_APPFW_SAFEOBJECT": msg20,
		"APPFW_APPFW_SIGNATURE_MATCH": select66,
		"APPFW_APPFW_SQL": select11,
		"APPFW_APPFW_STARTURL": msg16,
		"APPFW_APPFW_XSS": msg17,
		"APPFW_COOKIE": msg135,
		"APPFW_CSRF_TAG": msg136,
		"APPFW_FIELDCONSISTENCY": msg138,
		"APPFW_Message": select19,
		"APPFW_REFERER_HEADER": msg139,
		"APPFW_RESP_APPFW_XML_WSI_ERR_BODY_ENV_NAMESPACE": msg146,
		"APPFW_SIGNATURE_MATCH": msg140,
		"APPFW_STARTURL": msg137,
		"CITRIX_TVM": msg143,
		"CLI_CMD_EXECUTED": msg159,
		"CLUSTERD_Message": select60,
		"DR_HA_Message": msg27,
		"EVENT_ALERTENDED": msg28,
		"EVENT_ALERTSTARTED": msg29,
		"EVENT_CONFIGEND": msg30,
		"EVENT_CONFIGSTART": msg31,
		"EVENT_DEVICEDOWN": msg32,
		"EVENT_DEVICEOFS": msg33,
		"EVENT_DEVICEUP": msg34,
		"EVENT_LOGINFAILURE": msg184,
		"EVENT_MONITORDOWN": msg35,
		"EVENT_MONITORUP": msg36,
		"EVENT_NICRESET": msg37,
		"EVENT_ROUTEDOWN": msg38,
		"EVENT_ROUTEUP": msg39,
		"EVENT_STARTCPU": msg40,
		"EVENT_STARTSAVECONFIG": msg41,
		"EVENT_STARTSYS": msg42,
		"EVENT_STATECHANGE": select22,
		"EVENT_STOPSAVECONFIG": msg46,
		"EVENT_STOPSYS": msg47,
		"EVENT_UNKNOWN": msg48,
		"EVENT_VRIDINIT": msg124,
		"GUI_CMD_EXECUTED": select67,
		"ICA_APPLICATION_LAUNCH": msg178,
		"ICA_APPLICATION_TERMINATE": msg180,
		"ICA_CHANNEL_UPDATE": msg174,
		"ICA_Message": msg176,
		"ICA_NETWORK_UPDATE": msg173,
		"ICA_SESSION_SETUP": msg177,
		"ICA_SESSION_TERMINATE": msg179,
		"ICA_SESSION_UPDATE": msg175,
		"IPSEC_Message": msg127,
		"NSNETSVC_Message": msg128,
		"NSNETSVC_REQ_PARSE_ERROR": msg130,
		"PITBOSS_Message": select28,
		"RESPONDER_Message": select65,
		"ROUTING_Message": select29,
		"ROUTING_ZEBOS_CMD_EXECUTED": msg57,
		"SNMP_TRAP_SENT": select42,
		"SPCBId": msg134,
		"SSLLOG_SSL_HANDSHAKE_FAILURE": msg94,
		"SSLLOG_SSL_HANDSHAKE_ISSUERNAME": msg97,
		"SSLLOG_SSL_HANDSHAKE_SUBJECTNAME": msg96,
		"SSLLOG_SSL_HANDSHAKE_SUCCESS": msg95,
		"SSLVPN_AAAEXTRACTED_GROUPS": msg98,
		"SSLVPN_CLISEC_CHECK": msg93,
		"SSLVPN_CLISEC_EXP_EVAL": msg99,
		"SSLVPN_HTTPREQUEST": msg100,
		"SSLVPN_HTTP_RESOURCEACCESS_DENIED": msg129,
		"SSLVPN_ICAEND_CONNSTAT": select51,
		"SSLVPN_ICASTART": select53,
		"SSLVPN_LOGIN": msg103,
		"SSLVPN_LOGOUT": msg104,
		"SSLVPN_Message": msg109,
		"SSLVPN_NONHTTP_RESOURCEACCESS_DENIED": msg123,
		"SSLVPN_REMOVE_SESSION": msg171,
		"SSLVPN_REMOVE_SESSION_DEBUG": msg181,
		"SSLVPN_REMOVE_SESSION_ERR": msg170,
		"SSLVPN_REMOVE_SESSION_INFO": msg172,
		"SSLVPN_TCPCONNSTAT": msg110,
		"SSLVPN_TCPCONN_TIMEDOUT": msg105,
		"SSLVPN_UDPFLOWSTAT": msg106,
		"Source": select64,
		"TCP_CONN_DELINK": msg111,
		"TCP_CONN_TERMINATE": select55,
		"TCP_NAT_OTHERCONN_DELINK": msg115,
		"TCP_OTHERCONN_DELINK": msg114,
		"UI_CMD_EXECUTED": select58,
		"User": msg133,
	}),
]);

var part270 = // "Pattern{Field(saddr,true), Constant(' '), Field(p0,false)}"
match("MESSAGE#6:APPFW_APPFW_COOKIE/0", "nwparser.payload", "%{saddr->} %{p0}");

var part271 = // "Pattern{Field(url,true), Constant(' <<'), Field(disposition,false), Constant('>')}"
match("MESSAGE#7:APPFW_APPFW_DENYURL/2", "nwparser.p0", "%{url->} \u003c\u003c%{disposition}>");

var part272 = // "Pattern{Field(url,true), Constant(' '), Field(info,true), Constant(' <<'), Field(disposition,false), Constant('>')}"
match("MESSAGE#8:APPFW_APPFW_FIELDCONSISTENCY/2", "nwparser.p0", "%{url->} %{info->} \u003c\u003c%{disposition}>");

var part273 = // "Pattern{Constant('"'), Field(p0,false)}"
match("MESSAGE#20:APPFW_Message/0", "nwparser.payload", "\"%{p0}");

var part274 = // "Pattern{Constant('HASTATE '), Field(p0,false)}"
match("MESSAGE#23:DR_HA_Message/1_0", "nwparser.p0", "HASTATE %{p0}");

var part275 = // "Pattern{Field(network_service,false), Constant(': '), Field(p0,false)}"
match("MESSAGE#23:DR_HA_Message/1_1", "nwparser.p0", "%{network_service}: %{p0}");

var part276 = // "Pattern{Field(info,false), Constant('"')}"
match("MESSAGE#23:DR_HA_Message/2", "nwparser.p0", "%{info}\"");

var part277 = // "Pattern{Constant('for '), Field(dclass_counter1,false)}"
match("MESSAGE#24:EVENT_ALERTENDED/1_0", "nwparser.p0", "for %{dclass_counter1}");

var part278 = // "Pattern{Field(space,false)}"
match_copy("MESSAGE#24:EVENT_ALERTENDED/1_1", "nwparser.p0", "space");

var part279 = // "Pattern{Field(obj_type,true), Constant(' "'), Field(obj_name,false), Constant('"'), Field(p0,false)}"
match("MESSAGE#28:EVENT_DEVICEDOWN/0", "nwparser.payload", "%{obj_type->} \"%{obj_name}\"%{p0}");

var part280 = // "Pattern{Constant(' - State '), Field(event_state,false)}"
match("MESSAGE#28:EVENT_DEVICEDOWN/1_0", "nwparser.p0", " - State %{event_state}");

var part281 = // "Pattern{}"
match_copy("MESSAGE#28:EVENT_DEVICEDOWN/1_1", "nwparser.p0", "");

var part282 = // "Pattern{Field(obj_type,true), Constant(' '), Field(p0,false)}"
match("MESSAGE#31:EVENT_MONITORDOWN/0", "nwparser.payload", "%{obj_type->} %{p0}");

var part283 = // "Pattern{Field(obj_name,true), Constant(' - State '), Field(event_state,false)}"
match("MESSAGE#31:EVENT_MONITORDOWN/1_0", "nwparser.p0", "%{obj_name->} - State %{event_state}");

var part284 = // "Pattern{Constant(''), Field(obj_name,false)}"
match("MESSAGE#31:EVENT_MONITORDOWN/1_2", "nwparser.p0", "%{obj_name}");

var part285 = // "Pattern{Constant('" '), Field(p0,false)}"
match("MESSAGE#45:PITBOSS_Message1/0", "nwparser.payload", "\" %{p0}");

var part286 = // "Pattern{Constant(''), Field(info,false), Constant('"')}"
match("MESSAGE#45:PITBOSS_Message1/2", "nwparser.p0", "%{info}\"");

var part287 = // "Pattern{Constant('sysIpAddress = '), Field(hostip,false), Constant(')')}"
match("MESSAGE#54:SNMP_TRAP_SENT7/3_3", "nwparser.p0", "sysIpAddress = %{hostip})");

var part288 = // "Pattern{Field(,true), Constant(' '), Field(p0,false)}"
match("MESSAGE#86:SSLLOG_SSL_HANDSHAKE_FAILURE/0", "nwparser.payload", "%{} %{p0}");

var part289 = // "Pattern{Constant('ClientIP '), Field(p0,false)}"
match("MESSAGE#86:SSLLOG_SSL_HANDSHAKE_FAILURE/1_0", "nwparser.p0", "ClientIP %{p0}");

var part290 = // "Pattern{Constant('" '), Field(fld10,true), Constant(' GMT" - End_time '), Field(p0,false)}"
match("MESSAGE#93:SSLVPN_ICAEND_CONNSTAT/1_0", "nwparser.p0", "\" %{fld10->} GMT\" - End_time %{p0}");

var part291 = // "Pattern{Constant('" '), Field(fld10,false), Constant('" - End_time '), Field(p0,false)}"
match("MESSAGE#93:SSLVPN_ICAEND_CONNSTAT/1_1", "nwparser.p0", "\" %{fld10}\" - End_time %{p0}");

var part292 = // "Pattern{Field(fld10,true), Constant(' - End_time '), Field(p0,false)}"
match("MESSAGE#93:SSLVPN_ICAEND_CONNSTAT/1_2", "nwparser.p0", "%{fld10->} - End_time %{p0}");

var part293 = // "Pattern{Constant('" '), Field(fld11,true), Constant(' GMT" - Duration '), Field(p0,false)}"
match("MESSAGE#93:SSLVPN_ICAEND_CONNSTAT/2_0", "nwparser.p0", "\" %{fld11->} GMT\" - Duration %{p0}");

var part294 = // "Pattern{Constant('" '), Field(fld11,false), Constant('" - Duration '), Field(p0,false)}"
match("MESSAGE#93:SSLVPN_ICAEND_CONNSTAT/2_1", "nwparser.p0", "\" %{fld11}\" - Duration %{p0}");

var part295 = // "Pattern{Field(fld11,true), Constant(' - Duration '), Field(p0,false)}"
match("MESSAGE#93:SSLVPN_ICAEND_CONNSTAT/2_2", "nwparser.p0", "%{fld11->} - Duration %{p0}");

var part296 = // "Pattern{Constant('Context '), Field(fld1,true), Constant(' - SessionId: '), Field(sessionid,false), Constant('- User '), Field(p0,false)}"
match("MESSAGE#94:SSLVPN_LOGIN/1_0", "nwparser.p0", "Context %{fld1->} - SessionId: %{sessionid}- User %{p0}");

var part297 = // "Pattern{Constant('Context '), Field(fld1,true), Constant(' - User '), Field(p0,false)}"
match("MESSAGE#94:SSLVPN_LOGIN/1_1", "nwparser.p0", "Context %{fld1->} - User %{p0}");

var part298 = // "Pattern{Constant('User '), Field(p0,false)}"
match("MESSAGE#94:SSLVPN_LOGIN/1_2", "nwparser.p0", "User %{p0}");

var part299 = // "Pattern{Field(,true), Constant(' '), Field(username,false), Constant('- Client_ip '), Field(saddr,true), Constant(' - Nat_ip '), Field(p0,false)}"
match("MESSAGE#94:SSLVPN_LOGIN/2", "nwparser.p0", "%{} %{username}- Client_ip %{saddr->} - Nat_ip %{p0}");

var part300 = // "Pattern{Constant('"'), Field(stransaddr,false), Constant('" - Vserver '), Field(p0,false)}"
match("MESSAGE#94:SSLVPN_LOGIN/3_0", "nwparser.p0", "\"%{stransaddr}\" - Vserver %{p0}");

var part301 = // "Pattern{Field(stransaddr,true), Constant(' - Vserver '), Field(p0,false)}"
match("MESSAGE#94:SSLVPN_LOGIN/3_1", "nwparser.p0", "%{stransaddr->} - Vserver %{p0}");

var part302 = // "Pattern{Field(daddr,false), Constant(':'), Field(dport,true), Constant(' - Start_time '), Field(p0,false)}"
match("MESSAGE#95:SSLVPN_LOGOUT/4", "nwparser.p0", "%{daddr}:%{dport->} - Start_time %{p0}");

var part303 = // "Pattern{Constant('Context '), Field(fld1,true), Constant(' - SessionId: '), Field(sessionid,false), Constant('- User '), Field(username,true), Constant(' - Client_ip '), Field(hostip,true), Constant(' - Nat_ip '), Field(p0,false)}"
match("MESSAGE#97:SSLVPN_UDPFLOWSTAT/0", "nwparser.payload", "Context %{fld1->} - SessionId: %{sessionid}- User %{username->} - Client_ip %{hostip->} - Nat_ip %{p0}");

var part304 = // "Pattern{Field(,false), Constant('"'), Field(p0,false)}"
match("MESSAGE#100:SSLVPN_Message/0", "nwparser.payload", "%{}\"%{p0}");

var part305 = // "Pattern{Constant('Source '), Field(saddr,false), Constant(':'), Field(sport,true), Constant(' - Vserver '), Field(daddr,false), Constant(':'), Field(dport,true), Constant(' - NatIP '), Field(stransaddr,false), Constant(':'), Field(stransport,true), Constant(' - Destination '), Field(dtransaddr,false), Constant(':'), Field(dtransport,true), Constant(' - Delink Time '), Field(p0,false)}"
match("MESSAGE#102:TCP_CONN_DELINK/0", "nwparser.payload", "Source %{saddr}:%{sport->} - Vserver %{daddr}:%{dport->} - NatIP %{stransaddr}:%{stransport->} - Destination %{dtransaddr}:%{dtransport->} - Delink Time %{p0}");

var part306 = // "Pattern{Field(fld11,true), Constant(' GMT - Total_bytes_send '), Field(p0,false)}"
match("MESSAGE#102:TCP_CONN_DELINK/1_0", "nwparser.p0", "%{fld11->} GMT - Total_bytes_send %{p0}");

var part307 = // "Pattern{Field(fld11,true), Constant(' - Total_bytes_send '), Field(p0,false)}"
match("MESSAGE#102:TCP_CONN_DELINK/1_1", "nwparser.p0", "%{fld11->} - Total_bytes_send %{p0}");

var part308 = // "Pattern{Field(sbytes,true), Constant(' - Total_bytes_recv '), Field(rbytes,false)}"
match("MESSAGE#102:TCP_CONN_DELINK/2", "nwparser.p0", "%{sbytes->} - Total_bytes_recv %{rbytes}");

var part309 = // "Pattern{Constant('Source '), Field(saddr,false), Constant(':'), Field(sport,true), Constant(' - Destination '), Field(daddr,false), Constant(':'), Field(dport,true), Constant(' - Start Time '), Field(p0,false)}"
match("MESSAGE#103:TCP_CONN_TERMINATE/0", "nwparser.payload", "Source %{saddr}:%{sport->} - Destination %{daddr}:%{dport->} - Start Time %{p0}");

var part310 = // "Pattern{Field(fld10,true), Constant(' GMT - End Time '), Field(p0,false)}"
match("MESSAGE#103:TCP_CONN_TERMINATE/1_0", "nwparser.p0", "%{fld10->} GMT - End Time %{p0}");

var part311 = // "Pattern{Field(fld10,true), Constant(' - End Time '), Field(p0,false)}"
match("MESSAGE#103:TCP_CONN_TERMINATE/1_1", "nwparser.p0", "%{fld10->} - End Time %{p0}");

var part312 = // "Pattern{Field(info,true), Constant(' "')}"
match("MESSAGE#113:CLUSTERD_Message:02/1_1", "nwparser.p0", "%{info->} \"");

var part313 = // "Pattern{Constant('"'), Field(event_type,false), Constant(': '), Field(p0,false)}"
match("MESSAGE#158:AAA_Message/0", "nwparser.payload", "\"%{event_type}: %{p0}");

var part314 = // "Pattern{Constant('Sessionid '), Field(sessionid,true), Constant(' - User '), Field(username,true), Constant(' - Client_ip '), Field(saddr,true), Constant(' - Nat_ip '), Field(p0,false)}"
match("MESSAGE#167:SSLVPN_REMOVE_SESSION_ERR/0", "nwparser.payload", "Sessionid %{sessionid->} - User %{username->} - Client_ip %{saddr->} - Nat_ip %{p0}");

var part315 = // "Pattern{Constant('"'), Field(stransaddr,false), Constant('" - Vserver_ip '), Field(p0,false)}"
match("MESSAGE#167:SSLVPN_REMOVE_SESSION_ERR/1_0", "nwparser.p0", "\"%{stransaddr}\" - Vserver_ip %{p0}");

var part316 = // "Pattern{Field(stransaddr,true), Constant(' - Vserver_ip '), Field(p0,false)}"
match("MESSAGE#167:SSLVPN_REMOVE_SESSION_ERR/1_1", "nwparser.p0", "%{stransaddr->} - Vserver_ip %{p0}");

var part317 = // "Pattern{Field(daddr,true), Constant(' - Errmsg " '), Field(event_description,true), Constant(' "')}"
match("MESSAGE#167:SSLVPN_REMOVE_SESSION_ERR/2", "nwparser.p0", "%{daddr->} - Errmsg \" %{event_description->} \"");

var select72 = linear_select([
	dup21,
	dup22,
]);

var select73 = linear_select([
	dup25,
	dup26,
]);

var select74 = linear_select([
	dup32,
	dup33,
]);

var part318 = // "Pattern{Field(fld1,false), Constant(':UserLogin:'), Field(username,true), Constant(' - '), Field(event_description,true), Constant(' from client IP Address '), Field(saddr,false)}"
match("MESSAGE#84:SNMP_TRAP_SENT:05", "nwparser.payload", "%{fld1}:UserLogin:%{username->} - %{event_description->} from client IP Address %{saddr}", processor_chain([
	dup5,
	dup4,
]));

var select75 = linear_select([
	dup52,
	dup53,
	dup54,
]);

var select76 = linear_select([
	dup55,
	dup56,
	dup57,
]);

var select77 = linear_select([
	dup63,
	dup64,
	dup65,
]);

var select78 = linear_select([
	dup67,
	dup68,
]);

var select79 = linear_select([
	dup76,
	dup77,
]);

var select80 = linear_select([
	dup81,
	dup82,
]);

var part319 = // "Pattern{Constant('User '), Field(username,true), Constant(' - Remote_ip '), Field(saddr,true), Constant(' - Command "'), Field(action,false), Constant('" - Status "'), Field(disposition,false), Constant('"')}"
match("MESSAGE#109:UI_CMD_EXECUTED", "nwparser.payload", "User %{username->} - Remote_ip %{saddr->} - Command \"%{action}\" - Status \"%{disposition}\"", processor_chain([
	dup88,
	dup89,
	dup3,
	dup4,
]));

var part320 = // "Pattern{Field(product,false), Constant('|'), Field(version,false), Constant('|'), Field(rule,false), Constant('|'), Field(fld1,false), Constant('|'), Field(severity,false), Constant('|src='), Field(saddr,true), Constant(' spt='), Field(sport,true), Constant(' method='), Field(web_method,true), Constant(' request='), Field(url,true), Constant(' msg='), Field(info,true), Constant(' cn1='), Field(fld2,true), Constant(' cn2='), Field(fld3,true), Constant(' cs1='), Field(policyname,true), Constant(' cs2='), Field(fld5,true), Constant(' cs3='), Field(fld6,true), Constant(' cs4='), Field(severity,true), Constant(' cs5='), Field(fld8,true), Constant(' act='), Field(action,false)}"
match("MESSAGE#122:APPFW_COOKIE", "nwparser.payload", "%{product}|%{version}|%{rule}|%{fld1}|%{severity}|src=%{saddr->} spt=%{sport->} method=%{web_method->} request=%{url->} msg=%{info->} cn1=%{fld2->} cn2=%{fld3->} cs1=%{policyname->} cs2=%{fld5->} cs3=%{fld6->} cs4=%{severity->} cs5=%{fld8->} act=%{action}", processor_chain([
	dup9,
	dup91,
]));

var part321 = // "Pattern{Field(product,false), Constant('|'), Field(version,false), Constant('|'), Field(rule,false), Constant('|'), Field(fld1,false), Constant('|'), Field(severity,false), Constant('|src='), Field(saddr,true), Constant(' spt='), Field(sport,true), Constant(' method='), Field(web_method,true), Constant(' request='), Field(url,true), Constant(' msg='), Field(info,true), Constant(' cn1='), Field(fld2,true), Constant(' cn2='), Field(fld3,true), Constant(' cs1='), Field(policyname,true), Constant(' cs2='), Field(fld5,true), Constant(' cs4='), Field(severity,true), Constant(' cs5='), Field(fld8,true), Constant(' act='), Field(action,false)}"
match("MESSAGE#128:AF_400_RESP", "nwparser.payload", "%{product}|%{version}|%{rule}|%{fld1}|%{severity}|src=%{saddr->} spt=%{sport->} method=%{web_method->} request=%{url->} msg=%{info->} cn1=%{fld2->} cn2=%{fld3->} cs1=%{policyname->} cs2=%{fld5->} cs4=%{severity->} cs5=%{fld8->} act=%{action}", processor_chain([
	dup11,
	dup91,
]));

var part322 = // "Pattern{Field(info,false)}"
match_copy("MESSAGE#165:AAATM_Message:06", "nwparser.payload", "info", processor_chain([
	dup9,
	dup4,
]));

var select81 = linear_select([
	dup95,
	dup96,
]);

var all62 = all_match({
	processors: [
		dup20,
		dup98,
		dup23,
	],
	on_success: processor_chain([
		dup2,
		dup24,
		dup3,
		dup4,
	]),
});

var all63 = all_match({
	processors: [
		dup94,
		dup112,
		dup97,
	],
	on_success: processor_chain([
		dup9,
		dup4,
	]),
});
