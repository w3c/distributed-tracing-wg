# Distributed Tracing Working Group

## What is it?

We propose a set of HTTP headers which propagate a distributed trace and associated data, even when a request and its associated trace is served by multiple tracing providers.

These headers can also be propagated by systems that are not monitored but still need to participate in the trace to allow end-to-end tracing.

We further propose a header that can be used by tracing systems, cloud providers as well as application developers to propagate opaque properties between tiers.

![Trace Context Propagation](./assets/explainer_all_in_one.png "Trace Context Propagation")

## Why do we care?

Because there is no standardized way to propagate a trace, each tracing vendor has to create their own method of propagating tracing information. Typically this is in the form of a custom HTTP header. If an application request which is traced by one system flows through a system which is not traced using the same tracing platform, the headers may not be correctly propagated and the trace may be broken.

## Goals

- To provide a standard mechanism to propagate shared context across various architecture components so that multiple tracing platforms can be used in concert with each other.
- To provide a method for application developers to trace requests without invading users' privacy

## Non-goals
- Identification of individual users or user sessions
- Definition of (programming) language specific APIs for performance data collection
- Performance data analysis techniques or algorithms
- Web Browsers as a target implementation for this specification

## Concepts

### Distributed Trace
A distributed trace is a set of events, triggered as a result of a single logical operation, consolidated across various components of an application. A distributed trace contains events that cross process, network and security boundaries. A distributed trace may be initiated when someone presses a button to start an action on a website - in this case, the trace will represent calls made between the downstream services that handled the chain of requests initiated by this button being pressed.

### Trace Flags
Trace flags communicate information about the trace to remote tracing systems. For example, this can include information transmitted with the trace such as whether or not a particular request is "sampled," or captured by a tracing system.

## Headers

### Traceparent

The traceparent header is a request header which contains a trace id, a parent span id, and trace flags. A tracing system transmits the trace ID, span ID, and the ID of each span's parent span, if it exists, with each span to a tracing backend. The tracing backend uses this information to construct the directed acyclic graph which represents the trace. In a system with a single tracing platform, it is the only header necessary to complete a distributed trace.

### Tracestate

The tracestate header is a request header which allows a tracing platform to transmit platform-specific information, even through systems which are traced using other tracing platforms. Each tracing platform uses a single key, and the value is treated as an opaque token by other tracing platforms. Each tracing platform is required to forward tracestate keys and values.

### Trace Response header

We also propose a response header which can be used to report a trace ID back to the caller to
- report back a new trace ID in case the callee ignored the existing headers but started a new trace
- let proxies delegate sampling decisions to the caller
- allow tail-based sampling, where a sampling decision is deferred until a request is completed and all information pertinent to the sampling decision is known

### Baggage

The baggage header is used to propagate properties not defined in trace parent.

Common use cases are

* Defining an application specific context such as a member status on a trace
* Adding a marker for a/b testing
* Passing the callers name to the next component


## Examples

### Context loss using a proprietary header

1. Service A calls Service B through an API gateway.
2. The tracing system uses a proprietary header to propagate its trace ID.
3. The API gateway is not configured to propagate the proprietary header
4. Service C does not receive a trace ID and context is lost

![Context loss due to a middleware](./assets/explainer_context_loss.png "Context loss due to a middleware")

### Context propagation with W3C Trace Context
1. Service A calls Service B through an API gateway
2. The tracing system uses the W3C Trace Context header
3. The API gateway recognizes the headers as standards-compliant and allows them through
4. Service C receives the trace ID and continues the trace

![Context propagation through a standard compliant middleware](./assets/explainer_context_preserved.png "Context propagation through a standard compliant middleware")

### Response header used to correlate a request from a client application running in a web browser
1. The client application running in a browser does an initial XHR request to a service.
2. Service A starts the trace and sends back a response header that identifies the root span.
3. The client application running in the browser uses this information to provide a trace ID for all subsequent requests.

## Privacy
The introduction of a trace ID and response headers, naturally raises privacy concerns.
In summary it can be said, that everything the standard covers can be accomplished today
using existing technologies.
The standard provides an agreed-upon format to enable interoperability and additionally
adds privacy constraints that didn't exist before.

### Can a propgated trace ID be used to identify individual users?
Using proprietary ways of trace context propagation, vendors could always encode
information that contains user identifyable data.
The spec, on the other hand introduces [clear and strict privacy constraints](https://www.w3.org/TR/trace-context/#privacy-of-traceparent-field) that
forbid encoding user identifyable data.
As such, the standard restricts techniques that would be valid in proprietary trace context propagation solutions and leads to better overall privacy awareness in the industry.

### Can a response header returned to an application running in the browser be used to identify users?
Again, proprietary implementations already use different ways to solve this problem.
Namely, the same can be achieved by:
- encoding an ID into the payload returned to the client application running in the browser
- encoding an ID into server response timings

The intent of the standard is not to identify individual users but to provide a way
to tie frontend traces to backend traces to monitor performance.
Consequently, reloading a page would result in a new request from the client application and a new, random trace ID sent back to it.

### Can baggage be used to identify users?
Using proprietary ways of context propagation, vendors and application developers could always encode information that contains user identifyable data.
By standardizing this header, it will be possible to restrict propagation of baggage
when trust boundaries are crossed. This is not possible if each vendor uses their own proprietary headers.
