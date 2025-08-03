<?php

# Copyright (c) 2025 Ydemae
# Licensed under the AGPLv3 License. See LICENSE file for details.

namespace App\EventListener;

use Exception;
use phpDocumentor\Reflection\PseudoTypes\True_;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\RateLimiter\RateLimiterFactory;

#[AsEventListener(event: 'kernel.request', priority: 255)]
class RequestListener
{
    public function __construct(
        private RateLimiterFactory $anonymousApiLimiter
    ) {}

    public function onKernelRequest(RequestEvent $event): void
    {
        if (!$event->isMainRequest()) {
            return;
        }

        $request = $event->getRequest();
        $data = $request->getContent();

        if (!empty($data)){
            try{
                $jsonDecoded = json_decode($data, true);

                $sanitizedBody = [];

                foreach ($jsonDecoded as $key => $value){
                    $sanitizedBody[$key] = $this->sanitizeVar($value);
                }

                $request->attributes->set("sanitized_body", $sanitizedBody);
            }
            catch(Exception $e){
                dd($e);
                $response = new JsonResponse([
                    'result' => 'error',
                    'error' => 'Incorrect json structure'
                ], Response::HTTP_BAD_REQUEST);

                $event->setResponse($response);
                return;
            }
        }
        else{
            $request->attributes->set("sanitized_body", []);
        }

        $limiter = $this->anonymousApiLimiter->create($request->getClientIp());

        if (false === $limiter->consume(1)->isAccepted()) {
            $response = new JsonResponse([
                'result' => 'error',
                'error' => 'Rate limit exceeded'
            ], Response::HTTP_TOO_MANY_REQUESTS);

            $event->setResponse($response);
            return;
        }
    }

    public function sanitizeVar($var){
        if (is_array($var)){
            for ($i = 0; $i < count($var); $i++){
                if (is_array($var[$i])){
                    throw new Exception("Nested arrays, shouldn't happen in body");
                }

                $var[$i] = $this->sanitizeVar($var[$i]);
            }
            return $var;
        }

        if (is_null($var)){
            return null;
        }
        if (is_int($var)){
            return $var;
        }

        return $this->sanitizeString($var);
    }

    public function sanitizeString(string $toSanitize) : string{
        //Temporarily disabled, I'm wondering if it's necessary
        //return preg_replace("/[^A-Za-z0-9\ \-\.\!\^\'\(\)\<\>]/", '', $toSanitize);
        return $toSanitize;
    }
}