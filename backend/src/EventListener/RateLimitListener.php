<?php

# Copyright (c) 2025 Ydemae
# Licensed under the AGPLv3 License. See LICENSE file for details.

namespace App\EventListener;

use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\Attribute\Target;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpKernel\Event\ControllerEvent;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException;
use Symfony\Component\RateLimiter\RateLimiterFactory;

#[AsEventListener(event: 'kernel.request', priority: 10)]
class RateLimitListener
{
    public function __construct(
        #[Target('anonymous_api.limiter')] private RateLimiterFactory $anonymousApiLimiter,
        #[Target('login_route.limiter')] private RateLimiterFactory $loginRouteLimiter,
        #[Target('refresh_route.limiter')] private RateLimiterFactory $refreshRouteLimiter,
        private LoggerInterface $logger
    ) {}

    public function onKernelRequest(
        RequestEvent $event
    ): void
    {

        if (!$event->isMainRequest()) {
            return;
        }

        $request = $event->getRequest();
        $route = $request->attributes->get('_route');

        $limiter = match($route) {
            'login' => $this->loginRouteLimiter->create($request->getClientIp()),
            'gesdinet_jwt_refresh_token' => $this->refreshRouteLimiter->create($request->getClientIp()),
            default => $this->anonymousApiLimiter->create($request->getClientIp()),
        };


        if (false === $limiter->consume(1)->isAccepted()) {
            $this->logger->warning('Rate limit exceeded', [
                'ip' => $request->getClientIp(),
                'route' => $route
            ]);

            throw new TooManyRequestsHttpException(
                retryAfter: 300,
                message: 'Rate limit exceeded'
            );
        }
    }
}