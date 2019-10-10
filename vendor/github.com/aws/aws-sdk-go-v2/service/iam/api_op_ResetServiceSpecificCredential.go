// Code generated by private/model/cli/gen-api/main.go. DO NOT EDIT.

package iam

import (
	"context"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/internal/awsutil"
)

// Please also see https://docs.aws.amazon.com/goto/WebAPI/iam-2010-05-08/ResetServiceSpecificCredentialRequest
type ResetServiceSpecificCredentialInput struct {
	_ struct{} `type:"structure"`

	// The unique identifier of the service-specific credential.
	//
	// This parameter allows (through its regex pattern (http://wikipedia.org/wiki/regex))
	// a string of characters that can consist of any upper or lowercased letter
	// or digit.
	//
	// ServiceSpecificCredentialId is a required field
	ServiceSpecificCredentialId *string `min:"20" type:"string" required:"true"`

	// The name of the IAM user associated with the service-specific credential.
	// If this value is not specified, then the operation assumes the user whose
	// credentials are used to call the operation.
	//
	// This parameter allows (through its regex pattern (http://wikipedia.org/wiki/regex))
	// a string of characters consisting of upper and lowercase alphanumeric characters
	// with no spaces. You can also include any of the following characters: _+=,.@-
	UserName *string `min:"1" type:"string"`
}

// String returns the string representation
func (s ResetServiceSpecificCredentialInput) String() string {
	return awsutil.Prettify(s)
}

// Validate inspects the fields of the type to determine if they are valid.
func (s *ResetServiceSpecificCredentialInput) Validate() error {
	invalidParams := aws.ErrInvalidParams{Context: "ResetServiceSpecificCredentialInput"}

	if s.ServiceSpecificCredentialId == nil {
		invalidParams.Add(aws.NewErrParamRequired("ServiceSpecificCredentialId"))
	}
	if s.ServiceSpecificCredentialId != nil && len(*s.ServiceSpecificCredentialId) < 20 {
		invalidParams.Add(aws.NewErrParamMinLen("ServiceSpecificCredentialId", 20))
	}
	if s.UserName != nil && len(*s.UserName) < 1 {
		invalidParams.Add(aws.NewErrParamMinLen("UserName", 1))
	}

	if invalidParams.Len() > 0 {
		return invalidParams
	}
	return nil
}

// Please also see https://docs.aws.amazon.com/goto/WebAPI/iam-2010-05-08/ResetServiceSpecificCredentialResponse
type ResetServiceSpecificCredentialOutput struct {
	_ struct{} `type:"structure"`

	// A structure with details about the updated service-specific credential, including
	// the new password.
	//
	// This is the only time that you can access the password. You cannot recover
	// the password later, but you can reset it again.
	ServiceSpecificCredential *ServiceSpecificCredential `type:"structure"`
}

// String returns the string representation
func (s ResetServiceSpecificCredentialOutput) String() string {
	return awsutil.Prettify(s)
}

const opResetServiceSpecificCredential = "ResetServiceSpecificCredential"

// ResetServiceSpecificCredentialRequest returns a request value for making API operation for
// AWS Identity and Access Management.
//
// Resets the password for a service-specific credential. The new password is
// AWS generated and cryptographically strong. It cannot be configured by the
// user. Resetting the password immediately invalidates the previous password
// associated with this user.
//
//    // Example sending a request using ResetServiceSpecificCredentialRequest.
//    req := client.ResetServiceSpecificCredentialRequest(params)
//    resp, err := req.Send(context.TODO())
//    if err == nil {
//        fmt.Println(resp)
//    }
//
// Please also see https://docs.aws.amazon.com/goto/WebAPI/iam-2010-05-08/ResetServiceSpecificCredential
func (c *Client) ResetServiceSpecificCredentialRequest(input *ResetServiceSpecificCredentialInput) ResetServiceSpecificCredentialRequest {
	op := &aws.Operation{
		Name:       opResetServiceSpecificCredential,
		HTTPMethod: "POST",
		HTTPPath:   "/",
	}

	if input == nil {
		input = &ResetServiceSpecificCredentialInput{}
	}

	req := c.newRequest(op, input, &ResetServiceSpecificCredentialOutput{})
	return ResetServiceSpecificCredentialRequest{Request: req, Input: input, Copy: c.ResetServiceSpecificCredentialRequest}
}

// ResetServiceSpecificCredentialRequest is the request type for the
// ResetServiceSpecificCredential API operation.
type ResetServiceSpecificCredentialRequest struct {
	*aws.Request
	Input *ResetServiceSpecificCredentialInput
	Copy  func(*ResetServiceSpecificCredentialInput) ResetServiceSpecificCredentialRequest
}

// Send marshals and sends the ResetServiceSpecificCredential API request.
func (r ResetServiceSpecificCredentialRequest) Send(ctx context.Context) (*ResetServiceSpecificCredentialResponse, error) {
	r.Request.SetContext(ctx)
	err := r.Request.Send()
	if err != nil {
		return nil, err
	}

	resp := &ResetServiceSpecificCredentialResponse{
		ResetServiceSpecificCredentialOutput: r.Request.Data.(*ResetServiceSpecificCredentialOutput),
		response:                             &aws.Response{Request: r.Request},
	}

	return resp, nil
}

// ResetServiceSpecificCredentialResponse is the response type for the
// ResetServiceSpecificCredential API operation.
type ResetServiceSpecificCredentialResponse struct {
	*ResetServiceSpecificCredentialOutput

	response *aws.Response
}

// SDKResponseMetdata returns the response metadata for the
// ResetServiceSpecificCredential request.
func (r *ResetServiceSpecificCredentialResponse) SDKResponseMetdata() *aws.Response {
	return r.response
}
