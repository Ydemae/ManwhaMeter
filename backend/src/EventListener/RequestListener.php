<?php

namespace App\EventListener;

use Symfony\Component\HttpFoundation\JsonResponse;
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

        $limiter = $this->anonymousApiLimiter->create($request->getClientIp());

        if (false === $limiter->consume(1)->isAccepted()) {
            $response = new JsonResponse([
                'error' => 'Rate limit exceeded',
                'message' => 'Too many requests. Try again later.'
            ], Response::HTTP_TOO_MANY_REQUESTS);

            $event->setResponse($response);
        }
    }
}