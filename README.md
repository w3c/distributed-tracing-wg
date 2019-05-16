# Distributed Tracing Working group

This repository is associated with the [Distributed Tracing Working
Group](https://www.w3.org/2018/distributed-tracing/). It is used to work on
the group's charter and processes, and as an archive of meeting notes.

This is why you should join this [working group](WELCOME.md).

## Specs

Specification for distributed tracing context propagation format:

- Trace Context
  [Report](https://w3c.github.io/trace-context/).
  Status: [Candidate Recommendation](https://www.w3.org/2017/Process-20170301/#candidate-recommendation).
- Correlation Context
  [Report](https://w3c.github.io/correlation-context/).
  Status: editor draft.
- Working group [charter](https://www.w3.org/2018/07/distributed-tracing.html) (as of working group creation).
- Original [community group](https://www.w3.org/community/trace-context/).

## Team Communication

Overview of team related communication channels:

- GitHub issues for any specification related issues.
- Mailing List for general discussions. Please subscribe to
  [public-trace-context@w3.org](http://lists.w3.org/Archives/Public/public-trace-context/).
- Gitter Channel to reach the team:
  [TraceContext/Lobby](https://gitter.im/TraceContext/Lobby).
- Public Google calendar for all meetings and events [Google
  Calendar](https://calendar.google.com/calendar/embed?src=dynatrace.com_5a09qhua6fh7jb23h7vdjg6veg%40group.calendar.google.com).
- Recordings of previous meetings can be found [here](https://drive.google.com/drive/folders/1MQ-XnXVGjux2KH7FPp7mFGRDZHCx_HMH?usp=sharing)

We appreciate feedback and contributions. Please make sure to read rationale documents when you have a question about particular
decision made in specification.

## Goal

This specification defines formats to pass trace context information across systems. Our goal is
to share this with the community so that various tracing and diagnostics products can operate
together.

- If this becomes popular, frameworks and other services will automatically pass
  trace IDs through for correlated requests. This would prevent traces from
  hitting dead ends when a request reaches an un-instrumented service.
- Once aligned on a header name, we can ask for a CORS exception from the W3C.
  This would allow browsers to attach trace IDs to requests and submit tracing
  data to a distributed tracing service.
- Loggers can reliably parse trace / span IDs and include them in logs for
  correlation purposes.
- Customers can use multiple tracing solutions (Zipkin + New Relic) at the same
  time and not have to worry about propagating two sets of context headers.
- Frameworks can *bless* access to the trace context even if they prevent access
  to underlying request headers, making it available by default.

## Contributing

See [Contributing.md](CONTRIBUTING.md) for details.

- [Group participants](https://www.w3.org/2000/09/dbwg/details?group=108594&order=org&public=1)
- [How to join](https://www.w3.org/2004/01/pp-impl/108594/join)
- [Royalty-Free Patent Policy](https://www.w3.org/2004/01/pp-impl/108594/status)
