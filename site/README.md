
AWS S3 bucket policy for write-only public access for s3-upload user ONLY
{
    "Version": "2012-10-17",
    "Id": "PutOnlyPolicy",
    "Statement": [
        {
            "Sid": "Allow_PublicPut",
            "Effect": "Deny",
            "NotPrincipal": {
                "AWS": "arn:aws:iam::601385121207:user/s3-upload"
            },
            "Action": [
                "s3:PutObject",
                "s3:PutObjectAcl"
            ],
            "Resource": "arn:aws:s3:::dev2.bakelights.com/*"
        }
    ]
}

AWS S3 bucket CORS rules
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "HEAD",
            "GET",
            "PUT",
            "POST",
            "DELETE"
        ],
        "AllowedOrigins": [
            "*"
        ],
        "ExposeHeaders": [
            "ETag"
        ]
    }
]